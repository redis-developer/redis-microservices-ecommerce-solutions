//Note: Sample http proxy as api-gateway for demo purpose (only)

import express, { Express } from 'express';
import cors from 'cors';

import { SERVER_CONFIG } from '../../common/config/server-config';

import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from 'http-proxy-middleware';

//--- config
const PORT = SERVER_CONFIG.API_GATEWAY.PORT;

const ORDERS_API_PREFIX = SERVER_CONFIG.ORDERS_SERVICE.API.PREFIX;
const ORDERS_API_URL =
  SERVER_CONFIG.ORDERS_SERVICE.SERVER_ORIGIN +
  ':' +
  SERVER_CONFIG.ORDERS_SERVICE.PORT;

const ORDER_HISTORY_API_PREFIX = SERVER_CONFIG.ORDER_HISTORY_SERVICE.API.PREFIX;
const ORDER_HISTORY_API_URL =
  SERVER_CONFIG.ORDER_HISTORY_SERVICE.SERVER_ORIGIN +
  ':' +
  SERVER_CONFIG.ORDER_HISTORY_SERVICE.PORT;

const PRODUCTS_API_PREFIX = SERVER_CONFIG.PRODUCTS_SERVICE.API.PREFIX;
const PRODUCTS_API_URL =
  SERVER_CONFIG.PRODUCTS_SERVICE.SERVER_ORIGIN +
  ':' +
  SERVER_CONFIG.PRODUCTS_SERVICE.PORT;

//--- config ends

const app: Express = express();

app.use(cors());

app.use(
  ORDERS_API_PREFIX,
  createProxyMiddleware({
    // http://localhost:3000/orders/bar -> http://localhost:3001/orders/bar
    target: ORDERS_API_URL,
    changeOrigin: true,
  }),
);

app.use(
  ORDER_HISTORY_API_PREFIX,
  createProxyMiddleware({
    target: ORDER_HISTORY_API_URL,
    changeOrigin: true,
  }),
);

app.use(
  PRODUCTS_API_PREFIX,
  createProxyMiddleware({
    target: PRODUCTS_API_URL,
    changeOrigin: true,
  }),
);

app.listen(PORT);
