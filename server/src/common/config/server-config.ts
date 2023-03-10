interface IApiResponseBody {
  data: unknown;
  error: unknown;
  isFromCache?: boolean;
}

//@ts-ignore
const envVariables = process.env;

const REDIS_STREAMS = {
  ORDERS: {
    STREAM_NAME: 'ORDERS_STREAM',
    CONSUMER_GROUP_NAME: 'ORDERS_CON_GROUP',
    PAYMENTS_CONSUMER_NAME: 'PAYMENTS_CON',
  },
  PAYMENTS: {
    STREAM_NAME: 'PAYMENTS_STREAM',
    CONSUMER_GROUP_NAME: 'PAYMENTS_CON_GROUP',
    ORDERS_CONSUMER_NAME: 'ORDERS_CON',
  },
};

const COLLECTIONS = {
  ORDERS: {
    collectionName: 'orders',
    keyName: 'orderId',
  },
  PRODUCTS: {
    collectionName: 'products',
    keyName: 'productId',
  },
  PAYMENTS: {
    collectionName: 'payments',
    keyName: 'paymentId',
  },
};

const SERVER_CONFIG = {
  CACHE_ASIDE_EXPIRY: 30, //in seconds
  MONGO_DB_URI:
    envVariables.MONGO_DB_CONNECTION_URI ||
    'mongodb://localhost:27017/dbFashion',
  REDIS_URI: envVariables.REDIS_CONNECTION_URI || 'redis://localhost:6379',
  API_GATEWAY: {
    PORT: envVariables.API_GATEWAY_PORT || 3000,
  },
  ORDERS_SERVICE: {
    SERVER_ORIGIN:
      envVariables.ORDERS_SERVICE_CONTAINER_ORIGIN || 'http://localhost',
    PORT: envVariables.ORDERS_SERVICE_PORT || 3001,
    API: {
      PREFIX: '/orders',
      CREATE_ORDER: '/createOrder', // http://localhost:3000/orders/createOrder
    },
  },
  ORDER_HISTORY_SERVICE: {
    SERVER_ORIGIN:
      envVariables.ORDER_HISTORY_SERVICE_CONTAINER_ORIGIN || 'http://localhost',
    PORT: envVariables.ORDER_HISTORY_SERVICE_PORT || 3002,
    API: {
      PREFIX: '/orderHistory',
      VIEW_ORDER_HISTORY: '/viewOrderHistory',
    },
  },
  PRODUCTS_SERVICE: {
    SERVER_ORIGIN:
      envVariables.PRODUCTS_SERVICE_CONTAINER_ORIGIN || 'http://localhost',
    PORT: envVariables.PRODUCTS_SERVICE_PORT || 3003,
    API: {
      PREFIX: '/products',
      GET_PRODUCTS_BY_FILTER: '/getProductsByFilter',
    },
  },
  PAYMENTS_SERVICE: {
    SERVER_ORIGIN:
      envVariables.PAYMENTS_SERVICE_CONTAINER_ORIGIN || 'http://localhost',
    PORT: envVariables.PAYMENTS_SERVICE_PORT || 3004,
    API: {
      PREFIX: '/payments',
    },
  },
};

export { SERVER_CONFIG, COLLECTIONS, REDIS_STREAMS };

export type { IApiResponseBody };
