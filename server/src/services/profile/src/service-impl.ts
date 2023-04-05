import type { ITransactionStreamMessage } from '../../../common/models/misc';
import {
  IMessageHandler,
  nextTransactionStep,
  listenToStreams,
} from '../../../common/utils/redis/redis-streams';

import { TransactionStreamActions } from '../../../common/models/misc';
import { REDIS_STREAMS } from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';

const processTransactionStream: IMessageHandler = async (
  message: ITransactionStreamMessage,
  messageId,
) => {
  LoggerCls.info(`Incomming message in Profile Service ${messageId}`);
  if (message.action !== TransactionStreamActions.CALCULATE_PROFILE_SCORE) {
    return false;
  }

  // check profile score

  const orderDetails = JSON.stringify(message.orderDetails);

  await nextTransactionStep({
    ...message,
    logMessage: `Requesting next step in transaction risk scoring for the user ${message.userId}`,
  });

  return true;
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
