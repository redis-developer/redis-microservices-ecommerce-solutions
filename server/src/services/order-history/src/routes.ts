import express, { Request, Response } from "express";

import { HTTP_STATUS_CODES } from "../../../common/config/constants";
import { LoggerCls } from "../../../common/utils/logger";
import { SERVER_CONFIG, IApiResponseBody } from "../../../common/config/server-config";
import { viewOrderHistory } from "./service-impl";

const router = express.Router();
const API_NAMES = SERVER_CONFIG.ORDER_HISTORY_SERVICE.API;

router.get(API_NAMES.VIEW_ORDER_HISTORY, async (req: Request, res: Response) => {
    let userId = <string>req.query.userId;
    const result: IApiResponseBody = {
        data: null,
        error: null
    };

    try {
        result.data = await viewOrderHistory(userId);
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