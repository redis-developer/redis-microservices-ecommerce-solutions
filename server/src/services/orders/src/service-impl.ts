import type { IOrder, OrderWithIncludes, OrderProduct, Product } from '../../../common/models/order';



import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

import {
  ITransactionStreamMessage,
  TransactionPipelines,
} from '../../../common/models/misc';
import {
  IMessageHandler,
  nextTransactionStep,
  streamLog,
} from '../../../common/utils/redis/redis-streams';

import * as OrderRepo from '../../../common/models/order-repo';
import { TransactionStreamActions } from '../../../common/models/misc';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import {
  ISessionData,
  REDIS_STREAMS,
  SERVER_CONFIG
} from '../../../common/config/server-config';
import { USERS } from '../../../common/config/constants';
import { YupCls } from '../../../common/utils/yup';
import { LoggerCls } from '../../../common/utils/logger';
import { listenToStreams } from '../../../common/utils/redis/redis-streams';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';

const validateOrder = async (_order) => {
  const schema = yup.object().shape({
    orderId: yup.string(),
    userId: yup.string().required(),
    orderStatusCode: yup.number().required(),
    potentialFraud: yup.boolean().optional(),

    products: yup
      .array()
      .of(
        yup.object().shape({
          productId: yup.string().required(),
          qty: yup.number().required(),
          productPrice: yup.number().required(),
        }),
      )
      .min(1),

    createdBy: yup.string().required(),
    createdOn: yup.date().required(),
    lastUpdatedBy: yup.string().nullable(),
    statusCode: yup.number().required(),
  });

  //@ts-ignore
  _order = await YupCls.validateSchema(_order, schema);

  return _order;
};

const addProductDataToOrders = (order: OrderWithIncludes, products: Product[]) => {
  if (order && order.products?.length && products.length) {
    for (let orderedProduct of order.products) {
      const resultProduct = products.find(
        (_p) => _p.productId == orderedProduct.productId,
      );
      if (resultProduct) {
        orderedProduct.productData = resultProduct;
        orderedProduct.createdBy = order.createdBy;
        orderedProduct.createdOn = order.createdOn;
        orderedProduct.statusCode = DB_ROW_STATUS.ACTIVE;
      }
    }
  }
  return order;
};

const getProductDetails = async (order: OrderWithIncludes) => {
  let products: Product[] = [];

  if (order && order.products?.length) {
    const productIdArr = order.products.map((product) => {
      return product.productId;
    });

    const prisma = getPrismaClient();
    products = await prisma.product.findMany({
      where: {
        statusCode: DB_ROW_STATUS.ACTIVE,
        productId: {
          in: productIdArr,
        },
      },
    });
  }

  return products;
};

const addOrderToRedis = async (order: OrderWithIncludes) => {
  if (order) {
    const repository = OrderRepo.getRepository();

    await repository.save(order.orderId, order);
  }
};

const addOrderToPrismaDB = async (order: OrderWithIncludes) => {
  const prisma = getPrismaClient();
  await prisma.order.create({
    data: {
      orderId: order.orderId,
      orderStatusCode: order.orderStatusCode,
      potentialFraud: order.potentialFraud,
      userId: order.userId,
      createdBy: order.createdBy,

      products: {
        createMany: {
          data: <Prisma.OrderProductCreateManyOrderInput[]>order.products
        }
      }
    },
  });
};

const addMessageToTransactionStream = async (
  message: ITransactionStreamMessage,
) => {
  if (message) {
    const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
    await addMessageToStream(message, streamKeyName);
  }
};

const createOrder = async (
  order: IOrder,
  browserAgent: string,
  ipAddress: string,
  sessionId: string,
  sessionData: ISessionData,
) => {
  if (order) {
    const userId = order.userId || USERS.DEFAULT; //temp as no login/ users functionality;
    const orderId = uuidv4();

    order.orderId = orderId;
    order.orderStatusCode = ORDER_STATUS.CREATED;
    order.userId = userId;
    order.createdBy = userId;
    order.createdOn = new Date();
    order.statusCode = DB_ROW_STATUS.ACTIVE;
    order.potentialFraud = false;

    order = await validateOrder(order);

    const products = await getProductDetails(order);
    addProductDataToOrders(order, products);

    if (!SERVER_CONFIG.IS_RDI_ENABLED) {
      await addOrderToRedis(order);
    }

    /**
     * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
     * To keep it simple, adding  data to MongoDB manually in the same service
     */
    await addOrderToPrismaDB(order);

    await streamLog({
      action: 'CREATE_ORDER',
      message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order created with id ${orderId} for the user ${userId}`,
      metadata: {
        userId: userId,
        persona: sessionData.persona,
        sessionId: sessionId,
      },
    });

    let orderAmount = 0;
    order.products?.forEach((product) => {
      orderAmount += product.productPrice * product.qty;
    });

    const orderDetails: Partial<IOrder> = {
      orderId: orderId,
      orderAmount: orderAmount.toFixed(2),
      userId: userId,
      sessionId: sessionId,
      orderStatusCode: order.orderStatusCode,
      products: order.products,
    };

    await addMessageToTransactionStream({
      //adding Identity To TransactionStream
      action: TransactionPipelines.CHECKOUT[0],
      logMessage: `[${REDIS_STREAMS.CONSUMERS.IDENTITY}] Digital identity to be validated/ scored for the user ${userId}`,
      userId: userId,
      persona: sessionData.persona,
      sessionId: sessionId,
      orderDetails: orderDetails ? JSON.stringify(orderDetails) : '',
      transactionPipeline: JSON.stringify(TransactionPipelines.CHECKOUT),

      identityBrowserAgent: browserAgent,
      identityIpAddress: ipAddress,
    });

    return orderId;
  } else {
    throw 'Order data is mandatory!';
  }
};

const updateOrderStatusInRedis = async ({
  orderId,
  orderStatusCode,
  potentialFraud,
  userId,
}: Partial<OrderWithIncludes>) => {
  const repository = OrderRepo.getRepository();
  if (orderId && repository) {
    const dbOrder = await repository.fetch(orderId);

    dbOrder.orderStatusCode = orderStatusCode ?? dbOrder.orderStatusCode;
    dbOrder.potentialFraud =
      (potentialFraud === true || potentialFraud === false)
        ? potentialFraud
        : dbOrder.potentialFraud;
    dbOrder.lastUpdatedOn = new Date();
    dbOrder.lastUpdatedBy = userId;

    await repository.save(dbOrder);
  }
};

const updateOrderStatusInPrismaDB = async ({
  orderId,
  orderStatusCode,
  potentialFraud,
  userId,
}: Partial<OrderWithIncludes>) => {
  const prisma = getPrismaClient();

  const dbOrder = await prisma.order.findUnique({
    where: {
      orderId: orderId
    },
    select: {
      orderStatusCode: true,
      potentialFraud: true
    }
  });

  if (dbOrder) {
    await prisma.order.update({
      where: {
        orderId: orderId,
      },
      data: {
        orderStatusCode: orderStatusCode ?? dbOrder.orderStatusCode,
        potentialFraud: (potentialFraud === true || potentialFraud === false)
          ? potentialFraud
          : dbOrder.potentialFraud,
        lastUpdatedBy: userId,
        // lastUpdatedOn: new Date() //auto update
      },
    });
  }
};

const updateOrderStatus: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  let retVal = false;

  LoggerCls.info(`Incoming message in Order Service ${messageId}`);
  if (message.orderDetails) {
    const orderDetails: Partial<IOrder> = JSON.parse(message.orderDetails);

    if (orderDetails.orderId && orderDetails.paymentId && orderDetails.userId) {
      LoggerCls.info(`payment received ${orderDetails.paymentId}`);

      orderDetails.orderStatusCode = ORDER_STATUS.PAYMENT_SUCCESS;

      if (!SERVER_CONFIG.IS_RDI_ENABLED) {
        updateOrderStatusInRedis(orderDetails);
      }
      /**
       * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
       * To keep it simple, adding  data to MongoDB manually in the same service
       */
      updateOrderStatusInPrismaDB(orderDetails);

      message.orderDetails = JSON.stringify(orderDetails);

      await streamLog({
        action: TransactionStreamActions.ASSESS_RISK,
        message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order status updated after payment for orderId ${orderDetails.orderId} and user ${orderDetails.userId}`,
        metadata: message,
      });

      await nextTransactionStep(message);

      retVal = true;
    }
  }
  return retVal;
};

async function checkOrderRiskScore(message: ITransactionStreamMessage) {
  let retVal = false;

  LoggerCls.info(`Incoming message in Order Service`);
  if (message.orderDetails) {
    const orderDetails: Partial<IOrder> = JSON.parse(message.orderDetails);

    if (orderDetails.orderId && orderDetails.userId) {
      LoggerCls.info(
        `Transaction risk scoring for user ${message.userId} and order ${orderDetails.orderId}`,
      );

      const { identityScore, profileScore } = message;
      const identityScoreNumber = Number(identityScore);
      const profileScoreNumber = Number(profileScore);
      let potentialFraud = false;

      if (identityScoreNumber <= 0 || profileScoreNumber < 0.5) {
        LoggerCls.info(
          `Transaction risk score is too low for user ${message.userId} and order ${orderDetails.orderId}`,
        );

        await streamLog({
          action: TransactionStreamActions.ASSESS_RISK,
          message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order failed fraud checks for orderId ${orderDetails.orderId} and user ${message.userId}`,
          metadata: message,
        });

        potentialFraud = true;
      }

      orderDetails.orderStatusCode = ORDER_STATUS.PENDING;
      orderDetails.potentialFraud = potentialFraud;

      if (!SERVER_CONFIG.IS_RDI_ENABLED) {
        updateOrderStatusInRedis(orderDetails);
      }
      /**
       * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
       * To keep it simple, adding  data to MongoDB manually in the same service
       */
      updateOrderStatusInPrismaDB(orderDetails);

      message.orderDetails = JSON.stringify(orderDetails);

      await streamLog({
        action: TransactionStreamActions.ASSESS_RISK,
        message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order status updated after fraud checks for orderId ${orderDetails.orderId} and user ${message.userId}`,
        metadata: message,
      });

      await nextTransactionStep(message);

      retVal = true;
    }
  }
  return retVal;
}

const listen = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        eventHandlers: {
          [TransactionStreamActions.PAYMENT_PROCESSED]: updateOrderStatus,
          [TransactionStreamActions.ASSESS_RISK]: checkOrderRiskScore,
        },
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.ORDERS,
    consumerName: REDIS_STREAMS.CONSUMERS.ORDERS,
  });
};

const initialize = () => {
  listen();
};

export { createOrder, initialize };
