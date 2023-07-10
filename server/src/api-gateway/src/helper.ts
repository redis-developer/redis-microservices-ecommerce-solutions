import {
  ITransactionStreamMessage,
  TransactionPipelines,
} from '../../common/models/misc';

import { Request } from 'express';

import { REDIS_STREAMS } from '../../common/config/server-config';
import { addMessageToStream } from '../../common/utils/redis/redis-streams';

const addLoginToTransactionStream = async (req: Request) => {
  if (req && req.session && req.sessionId) {
    const session = JSON.parse(req.session);
    const userId = session.userId;
    const persona = session.persona;

    const entry: ITransactionStreamMessage = {
      action: TransactionPipelines.LOGIN[0],
      logMessage: `[${REDIS_STREAMS.CONSUMERS.IDENTITY}] Digital identity to be stored for the user ${userId}`,
      userId,
      persona,
      sessionId: req.sessionId,

      identityBrowserAgent: req.headers['user-agent'],
      identityIpAddress:
        req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
      transactionPipeline: JSON.stringify(TransactionPipelines.LOGIN),
    };

    const streamKeyName = REDIS_STREAMS.STREAMS.TRANSACTIONS;
    await addMessageToStream(entry, streamKeyName);
  }
};

export { addLoginToTransactionStream };
