import express, { Request, Response } from "express";

import { HTTP_STATUS_CODES } from "../../../common/config/constants";
import { LoggerCls } from "../../../common/utils/logger";
import { SERVER_CONFIG, IApiResponseBody } from "../../../common/config/server-config";

const router = express.Router();
const API_NAMES = SERVER_CONFIG.ORDERS_SERVICE.API;

router.post(API_NAMES.CREATE_ORDER, async (req: Request, res: Response) => {
    const body = req.body;
    const result: IApiResponseBody = {
        data: null,
        error: null
    };

    try {
        result.data = await Promise.resolve("Not implemented");
    }
    catch (err) {
        const pureErr = LoggerCls.getPureError(err);
        result.error = pureErr;
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        LoggerCls.error(`${API_NAMES.CREATE_ORDER} API failed !`, pureErr);
    }

    res.send(result);
});

router.get(API_NAMES.VIEW_ORDER_HISTORY, async (req: Request, res: Response) => {
    const params = req.params;
    //params.userId
    const result: IApiResponseBody = {
        data: null,
        error: null
    };

    try {
        result.data = await Promise.resolve("Not implemented");
    }
    catch (err) {
        const pureErr = LoggerCls.getPureError(err);
        result.error = pureErr;
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        LoggerCls.error(`${API_NAMES.VIEW_ORDER_HISTORY} API failed !`, pureErr);
    }

    res.send(result);
});


export {
    router
}