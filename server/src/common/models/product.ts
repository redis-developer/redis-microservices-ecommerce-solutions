import type {
  Product,
} from '@prisma/client';

import { Document } from 'mongodb'; //to allow other dynamic props

interface IProduct extends Product, Document {

}

export type { IProduct, Product };
