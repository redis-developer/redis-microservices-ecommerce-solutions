import type { Payment } from '@prisma/client';
import type { IOrder } from '../../../common/models/order';

import {
  IMessageHandler,
  nextTransactionStep,
  streamLog,
} from '../../../common/utils/redis/redis-streams';
import {
  ITransactionStreamMessage,
  TransactionStreamActions,
} from '../../../common/models/misc';

import { ORDER_STATUS, DB_ROW_STATUS } from '../../../common/models/order';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { listenToStreams } from '../../../common/utils/redis/redis-streams';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';

const processPayment: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  let retVal = false;
  LoggerCls.info(`Incoming message in Payment Service ${messageId}`);

  if (message.orderDetails) {
    const orderDetails: IOrder = JSON.parse(message.orderDetails);
    const userId = message.userId;
    LoggerCls.info(`order received ${orderDetails.orderId}`);

    //assume payment is processed successfully
    const paymentStatus = ORDER_STATUS.PAYMENT_SUCCESS;
    const orderAmount = parseFloat(orderDetails.orderAmount ?? '0');

    const prisma = getPrismaClient();
    const retPayObj: Payment = await prisma.payment.create({
      data: {
        orderId: orderDetails.orderId,
        orderAmount: orderAmount,
        paidAmount: orderAmount,
        orderStatusCode: paymentStatus,
        userId: userId ?? '',
        createdBy: userId ?? '',
        statusCode: DB_ROW_STATUS.ACTIVE,
      },
    });

    const paymentId = retPayObj.paymentId;

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
