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
  ASSESS_RISK = 'ASSESS_RISK',
  PROCESS_PAYMENT = 'PROCESS_PAYMENT',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
}

const TransactionPipelines = {
  LOGIN: [TransactionStreamActions.INSERT_LOGIN_IDENTITY],
  CHECKOUT: [
    TransactionStreamActions.CALCULATE_IDENTITY_SCORE,
    TransactionStreamActions.CALCULATE_PROFILE_SCORE,
    TransactionStreamActions.ASSESS_RISK,
    TransactionStreamActions.PROCESS_PAYMENT,
    TransactionStreamActions.PAYMENT_PROCESSED,
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

export { DB_ROW_STATUS, TransactionStreamActions, TransactionPipelines };
export type { ICommonFields, ITransactionStreamMessage };
