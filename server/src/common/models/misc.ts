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

export { DB_ROW_STATUS };
export type { ICommonFields };
