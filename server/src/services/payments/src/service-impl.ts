import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';
import {
  ITransactionStreamMessage,
  IOrdersStreamMessage,
  IPaymentsStreamMessage,
  TransactionPipelines,
} from '../../../common/models/misc';

import { IPayment } from '../../../common/models/payment';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import { TransactionStreamActions } from '../../../common/models/misc';
import {
  COLLECTIONS,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { listenToStreams } from '../../../common/utils/redis/redis-streams';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';

const addMessageToTransactionStream = async (
  message: ITransactionStreamMessage,
) => {
  if (message) {
    const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
    await addMessageToStream(message, streamKeyName);
  }
};

const addPaymentDetailsToStream = async (message: IPaymentsStreamMessage) => {
  if (message) {
    const streamKeyName = REDIS_STREAMS.STREAMS.PAYMENTS;
    await addMessageToStream(message, streamKeyName);
  }
};

const processPaymentForNewOrders: IMessageHandler = async (
  message: IOrdersStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Payment Service ${messageId}`);

  if (!(message && message.orderId && message.orderAmount)) {
    return false;
  }

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

  await addMessageToTransactionStream({
    //adding log To TransactionStream
    action: TransactionStreamActions.LOG,
    logMessage: `Payment ${paymentId} processed for the orderId ${message.orderId} and user ${userId}`,
    userId: userId,
    sessionId: message.sessionId,
    transactionPipeline: JSON.stringify(TransactionPipelines.LOG),
  });

  await addPaymentDetailsToStream({
    orderId: message.orderId,
    paymentId: paymentId,
    orderStatusCode: paymentStatus.toString(),
    userId: userId,
    sessionId: message.sessionId,
  });

  await addMessageToTransactionStream({
    //adding log To TransactionStream
    action: TransactionStreamActions.LOG,
    logMessage: `To update order status, payment details are added to ${REDIS_STREAMS.STREAMS.PAYMENTS} for the orderId ${message.orderId} and  user ${userId}`,
    userId: userId,
    sessionId: message.sessionId,
    transactionPipeline: JSON.stringify(TransactionPipelines.LOG),
  });

  return true;
};

const listenToOrdersStream = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.ORDERS,
        processMessageCallback: processPaymentForNewOrders,
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.PAYMENTS,
    consumerName: REDIS_STREAMS.CONSUMERS.PAYMENTS,
  });
};

const initialize = () => {
  listenToOrdersStream();
};

export { initialize };
