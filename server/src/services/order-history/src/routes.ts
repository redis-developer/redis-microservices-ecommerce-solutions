import type { IApiResponseBody } from '../../../common/config/server-config';

import express, { Request, Response } from 'express';

import { viewOrderHistory } from './service-impl';
import { HTTP_STATUS_CODES, USERS } from '../../../common/config/constants';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';

const router = express.Router();
const API_NAMES = SERVER_CONFIG.ORDER_HISTORY_SERVICE.API;

router.get(
  API_NAMES.VIEW_ORDER_HISTORY,
  async (req: Request, res: Response) => {
    const result: IApiResponseBody = {
      data: null,
      error: null,
    };

    const sessionData = req.header('x-session');
    const userId = sessionData ? JSON.parse(sessionData).userId : USERS.DEFAULT;

    try {
      result.data = await viewOrderHistory(userId);
    } catch (err) {
      const pureErr = LoggerCls.getPureError(err);
      result.error = pureErr;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      LoggerCls.error(`${API_NAMES.VIEW_ORDER_HISTORY} API failed !`, pureErr);
    }

    res.send(result);
  },
);

export { router };
