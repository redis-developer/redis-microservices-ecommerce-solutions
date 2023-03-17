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

enum RiskStreamActions {
  INSERT_LOGIN_IDENTITY = "INSERT_LOGIN_IDENTITY",
  CALCULATE_IDENTITY_SCORE = "CALCULATE_IDENTITY_SCORE",
  LOG_IDENTITY_SCORE = "LOG_IDENTITY_SCORE",
  LOG = "LOG",
}

interface IRiskStreamMessage {
  userId?: string;
  sessionId?: string;
  action: RiskStreamActions;
  logMessage?: string;

  identityBrowserAgent?: string;
  identityIpAddress?: string;
  identityScore?: string;

  profileScore?: string;
  mlScore?: string; //AI/ ML
  finalFraudScore?: string;

  others?: string;
}

export { DB_ROW_STATUS, RiskStreamActions };
export type { ICommonFields, IRiskStreamMessage };
