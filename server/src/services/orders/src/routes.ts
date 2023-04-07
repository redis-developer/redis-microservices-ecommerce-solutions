import type {
  IApiResponseBody,
  ISessionData,
} from '../../../common/config/server-config';

import express, { Request, Response } from 'express';

import { createOrder } from './service-impl';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { HTTP_STATUS_CODES, USERS } from '../../../common/config/constants';
import { LoggerCls } from '../../../common/utils/logger';

const router = express.Router();
const API_NAMES = SERVER_CONFIG.ORDERS_SERVICE.API;

router.post(API_NAMES.CREATE_ORDER, async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null,
  };

  const sessionDataStr = req.header('x-session');
  const sessionData: ISessionData = sessionDataStr
    ? JSON.parse(sessionDataStr)
    : null;
  const sessionId = req.header('x-sessionid') || '';
  const userId = sessionData ? sessionData.userId : USERS.DEFAULT;
  const browserAgent = req.headers['user-agent'] || '';
  const ipAddress =
    req.headers['x-forwarded-for']?.toString() ||
    req.socket.remoteAddress ||
    '';

  if (body && userId) {
    body.userId = userId;
  }
  try {
    result.data = await createOrder(
      body,
      browserAgent,
      ipAddress,
      sessionId,
      sessionData,
    );
  } catch (err) {
    const pureErr = LoggerCls.getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error(`${API_NAMES.CREATE_ORDER} API failed !`, pureErr);
  }

  res.send(result);
});

export { router };
