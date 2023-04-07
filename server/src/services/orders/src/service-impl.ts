import type { IProduct } from '../../../common/models/product';
import type { IOrder } from '../../../common/models/order';
import {
  ITransactionStreamMessage,
  IOrderDetails,
  TransactionPipelines,
} from '../../../common/models/misc';
import type { Document } from '../../../common/utils/mongodb/node-mongo-wrapper';
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
  COLLECTIONS,
  ISessionData,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import {
  USERS,
  MAX_DOCUMENTS_FETCH_LIMIT,
} from '../../../common/config/constants';
import { YupCls } from '../../../common/utils/yup';
import { LoggerCls } from '../../../common/utils/logger';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { listenToStreams } from '../../../common/utils/redis/redis-streams';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';

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
          productId: yup.number().required(),
          qty: yup.number().required(),
          productPrice: yup.number().required(),
        }),
      )
      .min(1),

    createdOn: yup.date().required(),
    createdBy: yup.string().required(),
    lastUpdatedOn: yup.date().nullable(),
    lastUpdatedBy: yup.string().nullable(),
    statusCode: yup.number().required(),
  });

  //@ts-ignore
  _order = await YupCls.validateSchema(_order, schema);

  return _order;
};

const addProductDataToOrders = (order: IOrder, products: IProduct[]) => {
  if (order && order.products?.length && products.length) {
    for (let orderedProduct of order.products) {
      orderedProduct.productData = products.find(
        (_p) => _p._id == orderedProduct.productId,
      )?.data;
    }
  }
  return order;
};
const getProductDetails = async (order: IOrder) => {
  let products: IProduct[] = [];

  if (order && order.products?.length) {
    const productIdArr = order.products.map((product) => {
      return product.productId;
    });

    const mongodbWrapperInst = getMongodb();
    const filter: Document = {
      statusCode: {
        $eq: DB_ROW_STATUS.ACTIVE,
      },
      _id: {
        //_id == productId
        $in: productIdArr,
      },
    };

    const projection: IProduct = {
      productId: 1,
      data: {
        id: 1,
        price: 1,
        productDisplayName: 1,
        variantName: 1,
        brandName: 1,
        ageGroup: 1,
        gender: 1,
        displayCategories: 1,
        masterCategory: {
          typeName: 1,
        },
        subCategory: {
          typeName: 1,
        },
        styleImages: {
          default: {
            imageURL: 1,
          },
        },
        productDescriptors: {
          description: {
            value: 1,
          },
        },
      },
    };
    const limit = MAX_DOCUMENTS_FETCH_LIMIT;
    const sort = {};
    products = await mongodbWrapperInst.find(
      COLLECTIONS.PRODUCTS.collectionName,
      filter,
      projection,
      limit,
      sort,
    );
  }

  return products;
};

const addOrderToRedis = async (order: IOrder) => {
  let orderId = '';
  if (order) {
    const repository = OrderRepo.getRepository();
    if (repository) {
      const entity = repository.createEntity(order);
      orderId = entity.entityId;
      entity.orderId = orderId;
      entity.productsStr = JSON.stringify(order.products);

      await repository.save(entity);
    }
  }

  return orderId;
};

const addOrderToMongoDB = async (order: IOrder) => {
  const mongodbWrapperInst = getMongodb();
  await mongodbWrapperInst.insertOne(
    COLLECTIONS.ORDERS.collectionName,
    COLLECTIONS.ORDERS.keyName,
    order,
  );
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

    order.orderStatusCode = ORDER_STATUS.CREATED;
    order.userId = userId;
    order.createdOn = new Date();
    order.createdBy = userId;
    order.lastUpdatedOn = null;
    order.lastUpdatedBy = null;
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
    await addOrderToMongoDB(order);

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

    const orderDetails: IOrderDetails = {
      orderId: orderId,
      orderAmount: orderAmount.toFixed(2),
      userId: userId,
      sessionId: sessionId,
      orderStatus: order.orderStatusCode,
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

interface UpdateOrder {
  orderId: string;
  paymentId?: string;
  orderStatus?: number;
  potentialFraud?: boolean;
  userId: string;
}

const updateOrderStatusInRedis = async ({
  orderId,
  paymentId,
  orderStatus,
  potentialFraud,
  userId,
}: UpdateOrder) => {
  const repository = OrderRepo.getRepository();
  if (orderId && repository) {
    const dbOrder = await repository.fetch(orderId);
    dbOrder.orderStatusCode = orderStatus ?? dbOrder.orderStatusCode;
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

const updateOrderStatusInMongoDB = async ({
  orderId,
  paymentId,
  orderStatus,
  potentialFraud,
  userId,
}: UpdateOrder) => {
  const mongodbWrapperInst = getMongodb();

  const filter: Document = {
    _id: orderId,
  };
  const updateDocument: Partial<IOrder> = {
    orderStatusCode: orderStatus,
    paymentId: paymentId,
    potentialFraud: potentialFraud,
    lastUpdatedOn: new Date(),
    lastUpdatedBy: userId,
  };
  const updateProp = {
    $set: updateDocument,
  };

  await mongodbWrapperInst.updateOne(
    COLLECTIONS.ORDERS.collectionName,
    filter,
    updateProp,
  );
};

const updateOrderStatus: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Order Service ${messageId}`);
  if (!message.orderDetails) {
    return false;
  }
  const orderDetails: IOrderDetails = JSON.parse(message.orderDetails);

  if (
    !(orderDetails.orderId && orderDetails.paymentId && orderDetails.userId)
  ) {
    return false;
  }

  LoggerCls.info(`payment received ${orderDetails.paymentId}`);

  orderDetails.orderStatus = ORDER_STATUS.PAYMENT_SUCCESS;

  updateOrderStatusInRedis(orderDetails);
  /**
   * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
   * To keep it simple, adding  data to MongoDB manually in the same service
   */
  updateOrderStatusInMongoDB(orderDetails);

  message.orderDetails = JSON.stringify(orderDetails);

  await streamLog({
    action: TransactionStreamActions.ASSESS_RISK,
    message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order status updated after payment for orderId ${orderDetails.orderId} and user ${orderDetails.userId}`,
    metadata: message,
  });

  await nextTransactionStep(message);

  return true;
};

async function checkOrderRiskScore(message: ITransactionStreamMessage) {
  LoggerCls.info(`Incomming message in Order Service`);
  if (!message.orderDetails) {
    return false;
  }

  const orderDetails: IOrderDetails = JSON.parse(message.orderDetails);

  if (!(orderDetails.orderId && orderDetails.userId)) {
    return false;
  }

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

  orderDetails.orderStatus = ORDER_STATUS.PENDING;
  orderDetails.potentialFraud = potentialFraud;

  updateOrderStatusInRedis(orderDetails);
  /**
   * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
   * To keep it simple, adding  data to MongoDB manually in the same service
   */
  updateOrderStatusInMongoDB(orderDetails);

  message.orderDetails = JSON.stringify(orderDetails);

  await streamLog({
    action: TransactionStreamActions.ASSESS_RISK,
    message: `[${REDIS_STREAMS.CONSUMERS.ORDERS}] Order status updated after fraud checks for orderId ${orderDetails.orderId} and user ${message.userId}`,
    metadata: message,
  });

  await nextTransactionStep(message);

  return true;
}

const listenToPaymentsStream = () => {
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
  listenToPaymentsStream();
};

export { createOrder, initialize };
