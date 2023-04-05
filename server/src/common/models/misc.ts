import { ObjectId } from 'mongodb';

enum DB_ROW_STATUS {
  ACTIVE = 1,
  INACTIVE = 0,
  TO_BE_PURGED = -1,
}

interface ICommonFields {
  _id?: ObjectId | number | string;
  createdOn?: string | Date | number; // ISO string/ date/ time number
  createdBy?: string;
  lastUpdatedOn?: string | Date | null | number;
  lastUpdatedBy?: string | null;
  statusCode?: DB_ROW_STATUS;
}

enum TransactionStreamActions {
  INSERT_LOGIN_IDENTITY = 'INSERT_LOGIN_IDENTITY',
  CALCULATE_IDENTITY_SCORE = 'CALCULATE_IDENTITY_SCORE',
  CALCULATE_PROFILE_SCORE = 'CALCULATE_PROFILE_SCORE',
  PROCESS_ORDER = 'PROCESS_ORDER',
}

const TransactionPipelines = {
  LOGIN: [TransactionStreamActions.INSERT_LOGIN_IDENTITY],
  CHECKOUT: [
    TransactionStreamActions.CALCULATE_IDENTITY_SCORE,
    TransactionStreamActions.CALCULATE_PROFILE_SCORE,
    TransactionStreamActions.PROCESS_ORDER,
  ],
};

interface ITransactionStreamMessage {
  action: TransactionStreamActions;
  logMessage?: string;
  userId?: string;
  persona?: string;
  sessionId?: string;
  orderDetails?: string;
  transactionPipeline: string;

  identityBrowserAgent?: string;
  identityIpAddress?: string;
  identityScore?: string;

  profileScore?: string;
  mlScore?: string; //AI/ ML
  finalFraudScore?: string;

  others?: string;
}

interface IOrdersStreamMessage {
  orderId?: string;
  orderAmount?: string;
  userId?: string;
  sessionId?: string;
}

interface IPaymentsStreamMessage {
  orderId?: string;
  paymentId?: string;
  orderStatusCode?: string;
  userId?: string;
  sessionId?: string;
}

export { DB_ROW_STATUS, TransactionStreamActions, TransactionPipelines };
export type {
  ICommonFields,
  ITransactionStreamMessage,
  IOrdersStreamMessage,
  IPaymentsStreamMessage,
};
