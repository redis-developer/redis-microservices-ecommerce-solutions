import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';

import { IPayment } from '../../../common/models/payment';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import {
  COLLECTIONS,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { getNodeRedisClient } from '../../../common/utils/redis/redis-wrapper';
import { listenToStream } from '../../../common/utils/redis/redis-streams';

const addPaymentIdToStream = async (
  orderId: string,
  paymentId: string,
  orderStatus: number,
  userId: string,
) => {
  const nodeRedisClient = getNodeRedisClient();
  if (orderId && nodeRedisClient) {
    const streamKeyName = REDIS_STREAMS.PAYMENTS.STREAM_NAME;
    const entry = {
      orderId: orderId,
      paymentId: paymentId,
      orderStatusCode: orderStatus.toString(),
      userId: userId,
    };
    const id = '*'; //* = auto generate
    await nodeRedisClient.xAdd(streamKeyName, id, entry);
  }
};

const processPaymentForNewOrders: IMessageHandler = async (
  message,
  messageId,
) => {
  if (message && message.orderId && message.orderAmount) {
    const userId = message.userId;
    LoggerCls.info(`order received ${message.orderId}`);

    //assume payment is processed successfully
    const paymentStatus = ORDER_STATUS.PAYMENT_SUCCESS;
    const orderAmount = parseFloat(message.orderAmount);
    const payment: IPayment = {
      orderId: message.orderId,
      orderAmount: orderAmount,
      paidAmount: orderAmount,
      orderStatusCode: paymentStatus,
      userId: userId,
      createdOn: new Date(),
      createdBy: userId,
      lastUpdatedOn: null,
      lastUpdatedBy: null,
      statusCode: DB_ROW_STATUS.ACTIVE,
    };

    const mongodbWrapperInst = getMongodb();
    const paymentId = await mongodbWrapperInst.insertOne(
      COLLECTIONS.PAYMENTS.collectionName,
      COLLECTIONS.PAYMENTS.keyName,
      payment,
    );

    await addPaymentIdToStream(
      message.orderId,
      paymentId,
      paymentStatus,
      userId,
    );
  }
};

const listenToOrdersStream = () => {
  listenToStream({
    streamKeyName: REDIS_STREAMS.ORDERS.STREAM_NAME,
    groupName: REDIS_STREAMS.ORDERS.CONSUMER_GROUP_NAME,
    consumerName: REDIS_STREAMS.ORDERS.PAYMENTS_CONSUMER_NAME,
    processMessageCallback: processPaymentForNewOrders,
  });
};

export { listenToOrdersStream };
