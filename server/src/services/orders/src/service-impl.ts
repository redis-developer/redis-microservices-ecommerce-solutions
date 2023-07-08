import type { Product, Order } from '@prisma/client';

import {
  ITransactionStreamMessage,
  IOrderDetails,
  TransactionPipelines,
} from '../../../common/models/misc';
import {
  IMessageHandler,
  nextTransactionStep,
  streamLog,
} from '../../../common/utils/redis/redis-streams';

import * as yup from 'yup';

import * as OrderRepo from '../../../common/models/order-repo';
import { TransactionStreamActions } from '../../../common/models/misc';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import {
  ISessionData,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import {
  USERS,
} from '../../../common/config/constants';
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
    lastUpdatedBy: yup.string().nullable(),
    statusCode: yup.number().required(),
  });

  //@ts-ignore
  _order = await YupCls.validateSchema(_order, schema);

  return _order;
};

const addProductDataToOrders = (order: Order, products: Product[]) => {
  if (order && order.products?.length && products.length) {
    for (let orderedProduct of order.products) {
      const resultProduct = products.find(
        (_p) => _p.productId == orderedProduct.productId,
      );
      if (resultProduct) {
        orderedProduct.productData = resultProduct;
      }
    }
  }
  return order;
};
const getProductDetails = async (order: Order) => {
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
          in: productIdArr
        }
      }
    });
  }

  return products;
};

const addOrderToRedis = async (order: Order) => {
  let orderId = '';
  if (order) {
    const repository = OrderRepo.getRepository();
    if (repository) {
      const entity = repository.createEntity(order);
      orderId = entity.entityId;
      entity.orderId = orderId;
      entity.productsStr = JSON.stringify(order.products); //TODO: UPDATE REDIS OM

      await repository.save(entity);
    }
  }

  return orderId;
};

const addOrderToPrismaDB = async (order: Order) => {
  const prisma = getPrismaClient();
  await prisma.order.create({
    data: order
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
  order: Order,
  browserAgent: string,
  ipAddress: string,
  sessionId: string,
  sessionData: ISessionData,
) => {
  if (order) {
    const userId = order.userId || USERS.DEFAULT; //temp as no login/ users functionality;

    order.orderStatusCode = ORDER_STATUS.CREATED;
    order.userId = userId;
    order.createdBy = userId;
    order.statusCode = DB_ROW_STATUS.ACTIVE;

    order = await validateOrder(order);

    const products = await getProductDetails(order);
    addProductDataToOrders(order, products);

    const orderId = await addOrderToRedis(order);
    order.orderId = orderId;

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

    const orderDetails: Partial<IOrderDetails> = {
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
  paymentId,
  orderStatusCode,
  potentialFraud,
  userId,
}: Partial<IOrderDetails>) => {
  const repository = OrderRepo.getRepository();
  if (orderId && repository) {
    const dbOrder = await repository.fetch(orderId);
    dbOrder.orderStatusCode = orderStatusCode ?? dbOrder.orderStatusCode;
    dbOrder.paymentId = paymentId ?? dbOrder.paymentId;
    dbOrder.potentialFraud =
      potentialFraud === true || potentialFraud === false
        ? potentialFraud
        : dbOrder.potentialFraud;
    dbOrder.lastUpdatedOn = new Date();
    dbOrder.lastUpdatedBy = userId;

    await repository.save(dbOrder);
  }
};

const updateOrderStatusInPrismaDB = async ({
  orderId,
  paymentId,
  orderStatusCode,
  potentialFraud,
  userId,
}: Partial<IOrderDetails>) => {

  const prisma = getPrismaClient();
  await prisma.order.update({
    where: {
      orderId: orderId
    },
    data: {
      orderStatusCode: orderStatusCode,
      potentialFraud: potentialFraud,
      lastUpdatedBy: userId,
    }
  });
};

const updateOrderStatus: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  let retVal = false;

  LoggerCls.info(`Incoming message in Order Service ${messageId}`);
  if (message.orderDetails) {
    const orderDetails: Partial<IOrderDetails> = JSON.parse(message.orderDetails);

    if (orderDetails.orderId && orderDetails.paymentId && orderDetails.userId) {
      LoggerCls.info(`payment received ${orderDetails.paymentId}`);

      orderDetails.orderStatusCode = ORDER_STATUS.PAYMENT_SUCCESS;

      updateOrderStatusInRedis(orderDetails);
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
    const orderDetails: Partial<IOrderDetails> = JSON.parse(message.orderDetails);

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

      updateOrderStatusInRedis(orderDetails);
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
