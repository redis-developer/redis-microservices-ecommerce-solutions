import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';
import type { ITransactionStreamMessage } from '../../../common/models/misc';

import { IPayment } from '../../../common/models/payment';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import { TransactionStreamActions } from '../../../common/models/misc';
import {
  COLLECTIONS,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { listenToStream } from '../../../common/utils/redis/redis-streams';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';

const addMessageToTransactionStream = async (message: ITransactionStreamMessage) => {
  if (message) {
    const streamKeyName = REDIS_STREAMS.TRANSACTION.STREAM_NAME;
    await addMessageToStream(message, streamKeyName);
  }
}

const addPaymentDetailsToStream = async (message: any) => {
  if (message) {
    const streamKeyName = REDIS_STREAMS.PAYMENTS.STREAM_NAME;
    await addMessageToStream(message, streamKeyName);
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

    await addMessageToTransactionStream({ //adding log To TransactionStream
      action: TransactionStreamActions.LOG,
      logMessage: `Payment ${paymentId} processed for the orderId ${message.orderId} and user ${userId}`,
      userId: userId,
      sessionId: message.sessionId,
    });

    await addPaymentDetailsToStream({
      orderId: message.orderId,
      paymentId: paymentId,
      orderStatusCode: paymentStatus.toString(),
      userId: userId,
      sessionId: message.sessionId,
    });

    await addMessageToTransactionStream({ //adding log To TransactionStream
      action: TransactionStreamActions.LOG,
      logMessage: `To update order status, payment details are added to ${REDIS_STREAMS.PAYMENTS.STREAM_NAME} for the orderId ${message.orderId} and  user ${userId}`,
      userId: userId,
      sessionId: message.sessionId,
    });
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
