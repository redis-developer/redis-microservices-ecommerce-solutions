import type { IRiskStreamMessage } from '../../common/models/misc';

import { Request } from 'express';

import { RiskStreamActions } from '../../common/models/misc';
import { REDIS_STREAMS } from '../../common/config/server-config';
import { addMessageToStream } from '../../common/utils/redis/redis-streams';

const addLoginToTransactionRiskStream = async (req: Request) => {

    if (req && req.session && req.sessionId) {
        const userId = JSON.parse(req.session).userId;

        const entry: IRiskStreamMessage = {
            userId: userId,
            sessionId: req.sessionId,
            action: RiskStreamActions.INSERT_LOGIN_IDENTITY,

            identityBrowserAgent: req.headers['user-agent'],
            identityIpAddress: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
        };

        const streamKeyName = REDIS_STREAMS.TRANSACTION_RISK.STREAM_NAME;
        await addMessageToStream(entry, streamKeyName);
    }
}

export {
    addLoginToTransactionRiskStream
}