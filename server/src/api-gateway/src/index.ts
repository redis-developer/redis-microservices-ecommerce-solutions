//Note: Sample http proxy as api-gateway for demo purpose (only)

import express, { Express, Request } from 'express';
import cors from 'cors';

import { SERVER_CONFIG } from '../../common/config/server-config';
import {
  setRedis,
  getNodeRedisClient,
  NodeRedisClientType,
} from '../../common/utils/redis/redis-wrapper';

import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from 'http-proxy-middleware';
import { randomUUID } from 'crypto';

//--- config
const PORT = SERVER_CONFIG.API_GATEWAY.PORT;
const REDIS_URI = SERVER_CONFIG.REDIS_URI;

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
app.use(async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  let sessionId = '';

  if (!!authorizationHeader) {
    sessionId = authorizationHeader.split(/\s/)[1] as string;
  } else {
    sessionId = randomUUID();
  }

  const redis = getNodeRedisClient() as NodeRedisClientType;

  if (!(await redis.exists(sessionId))) {
    await redis.set(sessionId, JSON.stringify({ userId: randomUUID() }));
  }

  req.session = (await redis.get(sessionId)) as string;
  res.setHeader('set-authorization', sessionId);

  next();
});

app.use(
  ORDERS_API_PREFIX,
  createProxyMiddleware({
    // http://localhost:3000/orders/bar -> http://localhost:3001/orders/bar
    target: ORDERS_API_URL,
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('x-session', req.session);
    },
  }),
);

app.use(
  ORDER_HISTORY_API_PREFIX,
  createProxyMiddleware({
    target: ORDER_HISTORY_API_URL,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost',
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('x-session', req.session);
    },
  }),
);

app.use(
  PRODUCTS_API_PREFIX,
  createProxyMiddleware({
    target: PRODUCTS_API_URL,
    changeOrigin: true,
  }),
);

app.listen(PORT, async () => {
  await setRedis(REDIS_URI);

  console.log(`Server is running at http://localhost:${PORT}`);
});
