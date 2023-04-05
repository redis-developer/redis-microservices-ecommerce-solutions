import type { IProduct } from '../../../common/models/product';
import type { IOrder } from '../../../common/models/order';
import {
  ITransactionStreamMessage,
  IOrdersStreamMessage,
  IPaymentsStreamMessage,
  TransactionPipelines,
} from '../../../common/models/misc';
import type { Document } from '../../../common/utils/mongodb/node-mongo-wrapper';
import {
  IMessageHandler,
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
const addOrderDetailsToStream = async (orderDetails: IOrdersStreamMessage) => {
  const streamKeyName = REDIS_STREAMS.STREAMS.ORDERS;
  await addMessageToStream(orderDetails, streamKeyName);
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
      message: `order created with id ${orderId} for the user ${userId}`,
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

    const orderDetails: IOrdersStreamMessage = {
      orderId: orderId,
      orderAmount: orderAmount.toFixed(2),
      userId: userId,
      sessionId: sessionId,
    };

    await addMessageToTransactionStream({
      //adding Identity To TransactionStream
      action: TransactionPipelines.CHECKOUT[0],
      logMessage: `Digital identity to be validated/ scored for the user ${userId}`,
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

const updateOrderStatusInRedis = async (
  orderId: string,
  paymentId: string,
  orderStatus: number,
  userId: string,
) => {
  const repository = OrderRepo.getRepository();
  if (orderId && paymentId && repository) {
    const order = await repository.fetch(orderId);
    order.orderStatusCode = orderStatus;
    order.paymentId = paymentId;
    order.lastUpdatedOn = new Date();
    order.lastUpdatedBy = userId;

    await repository.save(order);
  }
};

const updateOrderStatusInMongoDB = async (
  orderId: string,
  paymentId: string,
  orderStatus: number,
  userId: string,
) => {
  const mongodbWrapperInst = getMongodb();

  const filter: Document = {
    _id: orderId,
  };
  const updateDocument: IOrder = {
    orderStatusCode: orderStatus,
    paymentId: paymentId,
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
  message: IPaymentsStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Order Service ${messageId}`);
  if (
    !(
      message &&
      message.orderId &&
      message.paymentId &&
      message.orderStatusCode &&
      message.userId
    )
  ) {
    return false;
  }

  LoggerCls.info(`payment received ${message.paymentId}`);

  updateOrderStatusInRedis(
    message.orderId,
    message.paymentId,
    parseInt(message.orderStatusCode),
    message.userId,
  );
  /**
   * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
   * To keep it simple, adding  data to MongoDB manually in the same service
   */
  updateOrderStatusInMongoDB(
    message.orderId,
    message.paymentId,
    parseInt(message.orderStatusCode),
    message.userId,
  );

  await streamLog({
    action: TransactionStreamActions.PROCESS_ORDER,
    message: `Order status updated after payment for orderId ${message.orderId} and user ${message.userId}`,
    metadata: message,
  });

  return true;
};

const checkOrderFraudScore = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Order Service`);
  if (
    !(
      message.action === TransactionStreamActions.PROCESS_ORDER &&
      message.orderDetails
    )
  ) {
    return false;
  }

  const orderDetails: IOrdersStreamMessage = JSON.parse(message.orderDetails);

  if (!(orderDetails.orderId && orderDetails.userId)) {
    return false;
  }

  LoggerCls.info(
    `Transaction risk scoring for user ${message.userId} and order ${orderDetails.orderId}`,
  );

  updateOrderStatusInRedis(
    orderDetails.orderId,
    '',
    ORDER_STATUS.PENDING,
    orderDetails.userId,
  );
  /**
   * In real world scenario : can use RDI/ redis gears/ any other database to database sync strategy for REDIS-> MongoDB  data transfer.
   * To keep it simple, adding  data to MongoDB manually in the same service
   */
  updateOrderStatusInMongoDB(
    orderDetails.orderId,
    '',
    ORDER_STATUS.PENDING,
    orderDetails.userId,
  );

  await streamLog({
    action: TransactionStreamActions.PROCESS_ORDER,
    message: `Order status updated after fraud checks for orderId ${orderDetails.orderId} and user ${message.userId}`,
    metadata: message,
  });

  //step 3 - trigger "payment consumer" for the order
  await addOrderDetailsToStream(message);

  await streamLog({
    action: TransactionStreamActions.PROCESS_ORDER,
    message: `To process payment, order details are added to ${REDIS_STREAMS.STREAMS.ORDERS} for the user ${message.userId}`,
    metadata: message,
  });

  return true;
};

const listenToPaymentsStream = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.PAYMENTS,
        processMessageCallback: updateOrderStatus,
      },
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        processMessageCallback: checkOrderFraudScore,
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
