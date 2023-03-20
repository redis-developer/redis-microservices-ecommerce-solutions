import type { ITransactionStreamMessage } from '../../common/models/misc';

import { Request } from 'express';

import { TransactionStreamActions } from '../../common/models/misc';
import { REDIS_STREAMS } from '../../common/config/server-config';
import { addMessageToStream } from '../../common/utils/redis/redis-streams';

const addLoginToTransactionStream = async (req: Request) => {
  if (req && req.session && req.sessionId) {
    const userId = JSON.parse(req.session).userId;

    const entry: ITransactionStreamMessage = {
      action: TransactionStreamActions.INSERT_LOGIN_IDENTITY,
      logMessage: `Digital identity to be stored for the user ${userId}`,
      userId: userId,
      sessionId: req.sessionId,

      identityBrowserAgent: req.headers['user-agent'],
      identityIpAddress:
        req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
    };

    const streamKeyName = REDIS_STREAMS.TRANSACTION.STREAM_NAME;
    await addMessageToStream(entry, streamKeyName);
  }
};

export { addLoginToTransactionStream };
