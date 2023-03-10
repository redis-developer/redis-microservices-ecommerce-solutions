import type { ICommonFields } from './misc';

import { Document } from 'mongodb';

interface IProductData {
  id: number;
  price: number;
  productDisplayName: string | number; //number for mongo projection
  variantName?: string | number;
  brandName?: string | number;
  ageGroup?: string | number;
  gender?: string | number;
  displayCategories?: string | number;
  styleImages: {
    default: {
      imageURL: string | number;
    };
  };
  productDescriptors: {
    description: {
      value: string | number;
    };
  };
}

interface IProduct extends Document, ICommonFields {
  //fashion dataset schema
  productId?: number;
  data?: IProductData;
}

export type { IProduct, IProductData };
