interface IApiResponseBody {
  data: unknown;
  error: unknown;
  isFromCache?: boolean;
}

export interface ISessionData {
  userId: string;
  persona: string;
}

//@ts-ignore
const envVariables = process.env;

const REDIS_STREAMS = {
  GROUPS: {
    ORDERS: 'ORDERS_CON_GROUP',
    PAYMENTS: 'PAYMENTS_CON_GROUP',
    IDENTITY: 'IDENTITY_CON_GROUP',
    PROFILE: 'PROFILE_CON_GROUP',
  },
  CONSUMERS: {
    ORDERS: 'ORDERS_CON',
    PAYMENTS: 'PAYMENTS_CON',
    IDENTITY: 'IDENTITY_CON',
    PROFILE: 'PROFILE_CON',
  },
  STREAMS: {
    TRANSACTIONS: 'TRANSACTION_STREAM',
    LOG: 'LOG_STREAM',
  },
};

const REDIS_KEYS = {
  STATS: {
    TOTAL_PURCHASE_AMOUNT: "statsTotalPurchaseAmount",
    PRODUCT_PURCHASE_QTY_SET: "statsProductPurchaseQtySet",
    CATEGORY_PURCHASE_AMOUNT_SET: "statsCategoryPurchaseAmountSet",
    BRAND_PURCHASE_AMOUNT_SET: "statsBrandPurchaseAmountSet",
  }
}

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
    envVariables.DATABASE_URL || 'mongodb://localhost:27017/dbFashion',
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
      GET_ORDER_STATS: '/getOrderStats',
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
      TRIGGER_RESET_INVENTORY: '/triggerResetInventory',
      GET_ZIP_CODES: '/getZipCodes',
      GET_STORE_PRODUCTS_BY_GEO_FILTER: '/getStoreProductsByGeoFilter',
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
  DIGITAL_IDENTITY_SERVICE: {
    SERVER_ORIGIN:
      envVariables.DIGITAL_IDENTITY_SERVICE_CONTAINER_ORIGIN ||
      'http://localhost',
    PORT: envVariables.DIGITAL_IDENTITY_SERVICE_PORT || 3005,
    API: {
      PREFIX: '/digital-identity',
    },
  },
  PROFILE_SERVICE: {
    SERVER_ORIGIN:
      envVariables.PROFILE_SERVICE_CONTAINER_ORIGIN || 'http://localhost',
    PORT: envVariables.PROFILE_SERVICE_PORT || 3006,
    API: {
      PREFIX: '/profile',
    },
  },
  PRISMA_LOG: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'warn', //error, warn, info
    },
  ],
};

export { SERVER_CONFIG, COLLECTIONS, REDIS_STREAMS, REDIS_KEYS };

export type { IApiResponseBody };
