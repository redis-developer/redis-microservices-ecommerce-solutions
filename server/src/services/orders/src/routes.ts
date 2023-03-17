import type { IApiResponseBody } from '../../../common/config/server-config';
import type { IRiskStreamMessage } from '../../../common/models/misc';

import express, { Request, Response } from 'express';

import { createOrder } from './service-impl';
import { RiskStreamActions } from '../../../common/models/misc';
import { SERVER_CONFIG, REDIS_STREAMS } from '../../../common/config/server-config';
import { HTTP_STATUS_CODES, USERS } from '../../../common/config/constants';
import { LoggerCls } from '../../../common/utils/logger';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';


const router = express.Router();
const API_NAMES = SERVER_CONFIG.ORDERS_SERVICE.API;

router.post(API_NAMES.CREATE_ORDER, async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  const sessionData = req.header('x-session');
  const sessionId = req.header('x-sessionid');
  const userId = sessionData ? JSON.parse(sessionData).userId : USERS.DEFAULT;
  if (body && userId) {
    body.userId = userId;
  }
  try {
    await addIdentityToTransactionRiskStream(req, userId, sessionId);

    result.data = await createOrder(body);

  } catch (err) {
    const pureErr = LoggerCls.getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error(`${API_NAMES.CREATE_ORDER} API failed !`, pureErr);
  }

  res.send(result);
});

const addIdentityToTransactionRiskStream = async (req: Request, userId: string, sessionId?: string) => {
  if (req && userId) {

    const entry: IRiskStreamMessage = {
      userId: userId,
      sessionId: sessionId,
      action: RiskStreamActions.CALCULATE_IDENTITY_SCORE,

      identityBrowserAgent: req.headers['user-agent'],
      identityIpAddress: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
    };

    const streamKeyName = REDIS_STREAMS.TRANSACTION_RISK.STREAM_NAME;
    await addMessageToStream(entry, streamKeyName);
  }
}

export { router };
