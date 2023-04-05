import type { ITransactionStreamMessage } from '../../../common/models/misc';
import type { IMessageHandler } from '../../../common/utils/redis/redis-streams';

import { TransactionStreamActions } from '../../../common/models/misc';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import {
  listenToStreams,
  addMessageToStream,
} from '../../../common/utils/redis/redis-streams';
import { LoggerCls } from '../../../common/utils/logger';

const addMessageToTransactionStream = async (
  message: ITransactionStreamMessage,
) => {
  const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
  await addMessageToStream(message, streamKeyName);
};

const processTransactionStream: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Profile Service ${messageId}`);
  if (message) {
    if (message.action == TransactionStreamActions.CALCULATE_PROFILE_SCORE) {
      // check profile score

      const transactionPipeline: TransactionStreamActions[] = JSON.parse(
        message.transactionPipeline,
      );
      transactionPipeline.shift();

      if (transactionPipeline.length <= 0) {
        return true;
      }

      await addMessageToTransactionStream({
        ...message,
        action: transactionPipeline[0],
        logMessage: `Requesting next step (${transactionPipeline[0]}) in transaction risk scoring for the user ${message.userId}`,
        transactionPipeline: JSON.stringify(transactionPipeline),
      });

      return true;
    }
  }

  return false;
};

const listenToTransactionStream = () => {
  listenToStreams({
    streams: [
      {
        streamKeyName: REDIS_STREAMS.STREAMS.TRANSACTIONS,
        processMessageCallback: processTransactionStream,
      },
    ],
    groupName: REDIS_STREAMS.GROUPS.PROFILE,
    consumerName: REDIS_STREAMS.CONSUMERS.PROFILE,
  });
};

const initialize = () => {
  listenToTransactionStream();
};

export { initialize };
