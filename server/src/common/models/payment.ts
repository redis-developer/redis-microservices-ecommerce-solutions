import { Document } from 'mongodb';

import { ICommonFields } from './misc';
import { ORDER_STATUS } from './order';

interface IPayment extends Document, ICommonFields {
  paymentId?: string;
  orderId?: string;
  orderAmount?: number;
  paidAmount?: number;
  orderStatusCode?: ORDER_STATUS;
  userId?: string;
}

export type { IPayment };
