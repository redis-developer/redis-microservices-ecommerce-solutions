import type { IApiResponseBody } from '../../../common/config/server-config';

import express, { Request, Response } from 'express';

import {
  getProductsByFilter, triggerResetInventory,
  getZipCodes, getStoreProductsByGeoFilter
} from './service-impl';
import { HTTP_STATUS_CODES } from '../../../common/config/constants';
import { SERVER_CONFIG } from '../../../common/config/server-config';
import { LoggerCls } from '../../../common/utils/logger';
import { RedisCacheAside } from '../../../common/utils/redis/redis-cache-aside';

const router = express.Router();
const API_NAMES = SERVER_CONFIG.PRODUCTS_SERVICE.API;

router.post(
  API_NAMES.GET_PRODUCTS_BY_FILTER,
  async (req: Request, res: Response) => {
    const body = req.body;
    const result: IApiResponseBody = {
      data: null,
      error: null,
      isFromCache: false,
    };

    try {
      const cachedData = await RedisCacheAside.getDataFromRedis(body);
      if (cachedData && cachedData.length) {
        result.data = cachedData;
        result.isFromCache = true;
      } else {
        const dbData = await getProductsByFilter(body);

        if (body && body.productDisplayName && dbData.length) {
          //skipping cache for default empty search
          RedisCacheAside.setDataInRedis(
            body,
            dbData,
            SERVER_CONFIG.CACHE_ASIDE_EXPIRY,
          ); //set async
        }
        result.data = dbData;
      }
    } catch (err) {
      const pureErr = LoggerCls.getPureError(err);
      result.error = pureErr;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      LoggerCls.error(
        `${API_NAMES.GET_PRODUCTS_BY_FILTER} API failed !`,
        pureErr,
      );
    }

    res.send(result);
  },
);

router.post(
  API_NAMES.TRIGGER_RESET_INVENTORY,
  async (req: Request, res: Response) => {
    const body = req.body;
    const result: IApiResponseBody = {
      data: null,
      error: null,
    };

    try {
      result.data = await triggerResetInventory();
    } catch (err) {
      const pureErr = LoggerCls.getPureError(err);
      result.error = pureErr;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      LoggerCls.error(
        `${API_NAMES.TRIGGER_RESET_INVENTORY} API failed !`,
        pureErr,
      );
    }

    res.send(result);
  },
);

router.post(
  API_NAMES.GET_ZIP_CODES,
  async (req: Request, res: Response) => {
    const body = req.body;
    const result: IApiResponseBody = {
      data: null,
      error: null,
    };

    try {

      const zipCodes = await getZipCodes();
      result.data = zipCodes;

    } catch (err) {
      const pureErr = LoggerCls.getPureError(err);
      result.error = pureErr;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      LoggerCls.error(
        `${API_NAMES.GET_ZIP_CODES} API failed !`,
        pureErr,
      );
    }

    res.send(result);
  },
);

router.post(
  API_NAMES.GET_STORE_PRODUCTS_BY_GEO_FILTER,
  async (req: Request, res: Response) => {
    const body = req.body;
    const result: IApiResponseBody = {
      data: null,
      error: null,
    };

    try {

      const storeProducts = await getStoreProductsByGeoFilter(body);
      result.data = storeProducts;

    } catch (err) {
      const pureErr = LoggerCls.getPureError(err);
      result.error = pureErr;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      LoggerCls.error(
        `${API_NAMES.GET_STORE_PRODUCTS_BY_GEO_FILTER} API failed !`,
        pureErr,
      );
    }

    res.send(result);
  },
);

export { router };
