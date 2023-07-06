import type { ICommonFields } from './misc';
import type { IProduct } from './product';

import { Document } from 'mongodb';

import { DB_ROW_STATUS } from './misc';

enum ORDER_STATUS {
  PAYMENT_FAIL = -4,
  DRAFT = 0,
  CREATED = 1,
  PENDING = 2,
  PAYMENT_INITIATED = 3,
  PAYMENT_SUCCESS = 4,
}

interface IOrderProduct {
  productId: string;
  qty: number;
  productPrice: number;
  productData?: IProduct;
}

interface IOrder extends Document, ICommonFields {
  orderId?: string;
  userId?: string;
  orderStatusCode?: ORDER_STATUS;
  paymentId?: string;
  potentialFraud?: boolean;

  products: IOrderProduct[];
  productsStr?: string; //temp redis om
}

export { ORDER_STATUS, DB_ROW_STATUS };
export type { IOrder, IOrderProduct };
