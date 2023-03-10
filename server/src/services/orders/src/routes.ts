import type { IApiResponseBody } from '../../../common/config/server-config';

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

  const sessionData = req.header('x-session');
  const userId = sessionData ? JSON.parse(sessionData).userId : USERS.DEFAULT;
  if (body && userId) {
    body.userId = userId;
  }
  try {
    result.data = await createOrder(body);
  } catch (err) {
    const pureErr = LoggerCls.getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error(`${API_NAMES.CREATE_ORDER} API failed !`, pureErr);
  }

  res.send(result);
});

export { router };
