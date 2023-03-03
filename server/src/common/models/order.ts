import type { IProductData } from './product';

import { Document } from 'mongodb';

import { DB_ROW_STATUS, ICommonFields } from './misc';

enum ORDER_STATUS {
  PAYMENT_FAIL = -2,
  DRAFT = 0,
  CREATED = 1,
  PAYMENT_SUCCESS = 2,
}

interface IOrderProduct {
  productId: number;
  qty: number;
  productPrice: number;
  productData?: IProductData;
}

interface IOrder extends Document, ICommonFields {
  orderId?: string;
  userId?: string;
  orderStatusCode?: ORDER_STATUS;
  paymentId?: string;

  products?: IOrderProduct[];
  productsStr?: string; //temp redis om
}

export { IOrder, ORDER_STATUS, DB_ROW_STATUS };
