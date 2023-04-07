import {
  IMessageHandler,
  nextTransactionStep,
  streamLog,
} from '../../../common/utils/redis/redis-streams';
import {
  ITransactionStreamMessage,
  IOrderDetails,
  TransactionStreamActions,
} from '../../../common/models/misc';

import { IPayment } from '../../../common/models/payment';
import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import {
  COLLECTIONS,
  REDIS_STREAMS,
} from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';
import { listenToStreams } from '../../../common/utils/redis/redis-streams';

const processPayment: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  let retVal = false;
  LoggerCls.info(`Incoming message in Payment Service ${messageId}`);

  if (message.orderDetails) {
    const orderDetails: IOrderDetails = JSON.parse(message.orderDetails);
    const userId = message.userId;
    LoggerCls.info(`order received ${orderDetails.orderId}`);

    //assume payment is processed successfully
    const paymentStatus = ORDER_STATUS.PAYMENT_SUCCESS;
    const orderAmount = parseFloat(orderDetails.orderAmount);
    const payment: IPayment = {
      orderId: orderDetails.orderId,
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

    await streamLog({
      action: TransactionStreamActions.PROCESS_PAYMENT,
      message: `[${REDIS_STREAMS.CONSUMERS.PAYMENTS}] Payment ${paymentId} processed for the orderId ${orderDetails.orderId} and user ${userId}`,
      metadata: message,
    });

    orderDetails.paymentId = paymentId;
    message.orderDetails = JSON.stringify(orderDetails);
    await nextTransactionStep(message);

    retVal = true;
  }
  return retVal;
};

const listen = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        eventHandlers: {
          [TransactionStreamActions.PROCESS_PAYMENT]: processPayment,
        },
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.PAYMENTS,
    consumerName: REDIS_STREAMS.CONSUMERS.PAYMENTS,
  });
};

const initialize = () => {
  listen();
};

export { initialize };
