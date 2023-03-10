//Note: Sample http proxy as api-gateway for demo purpose (only)

import cors from 'cors';
import { randomUUID } from 'crypto';
import express, { Express, Request } from 'express';
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware';

import { SERVER_CONFIG } from '../../common/config/server-config';
import {
  setRedis,
  getNodeRedisClient,
} from '../../common/utils/redis/redis-wrapper';

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

//---- helpers

const getSessionInfo = async (authHeader?: string) => {
  // (For demo purpose only) random userId and sessionId values are created for first time, then userId is fetched gainst that sessionId for future requests

  let sessionId = '';
  let sessionData: string | null = '';

  if (!!authHeader) {
    sessionId = authHeader.split(/\s/)[1];
  } else {
    sessionId = 'SES_' + randomUUID(); //random new sessionId
  }

  const nodeRedisClient = getNodeRedisClient();
  if (nodeRedisClient) {
    const exists = await nodeRedisClient.exists(sessionId);
    if (!exists) {
      await nodeRedisClient.set(
        sessionId,
        JSON.stringify({ userId: 'USR_' + randomUUID() }),
      ); //random new userId
    }
    sessionData = await nodeRedisClient.get(sessionId);
  }

  return {
    sessionId: sessionId,
    sessionData: sessionData,
  };
};

const applyAuthToResponse = responseInterceptor(
  // adding sessionId to the response so that front end can store it for future requests

  async (responseBuffer, proxyRes, req, res) => {
    // detect json responses
    if (
      !!proxyRes.headers['content-type'] &&
      proxyRes.headers['content-type'].includes('application/json')
    ) {
      let data = JSON.parse(responseBuffer.toString('utf8'));

      // manipulate JSON data here
      if (!!(req as Request).sessionId) {
        data = Object.assign({}, data, { auth: (req as Request).sessionId });
      }

      // return manipulated JSON
      return JSON.stringify(data);
    }

    // return other content-types as-is
    return responseBuffer;
  },
);
//---- helpers ends

const app: Express = express();

app.use(cors());
app.use(async (req, res, next) => {
  //set session details to be used by other microservices

  const authorizationHeader = req.header('Authorization');
  const sessionInfo = await getSessionInfo(authorizationHeader);

  if (sessionInfo?.sessionData && sessionInfo?.sessionId) {
    req.session = sessionInfo?.sessionData; //req.session custom property
    req.sessionId = sessionInfo?.sessionId;
  }
  next();
});

app.use(
  ORDERS_API_PREFIX,
  createProxyMiddleware({
    // http://localhost:3000/orders/bar -> http://localhost:3001/orders/bar
    target: ORDERS_API_URL,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('x-session', req.session);
    },
    onProxyRes: applyAuthToResponse,
  }),
);

app.use(
  ORDER_HISTORY_API_PREFIX,
  createProxyMiddleware({
    target: ORDER_HISTORY_API_URL,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('x-session', req.session);
    },
    onProxyRes: applyAuthToResponse,
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
