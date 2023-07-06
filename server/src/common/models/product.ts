import type { ICommonFields } from './misc';

import { Document } from 'mongodb';

interface IProduct extends Document, ICommonFields {
  // | number for mongo projection
  productId?: string | number; // _id in database

  price?: number;
  productDisplayName?: string | number;
  variantName?: string | number;
  brandName?: string | number;
  ageGroup?: string | number;
  gender?: string | number;
  displayCategories?: string | number;

  masterCategory_typeName?: string | number;
  subCategory_typeName?: string | number;
  styleImages_default_imageURL?: string | number;
  productDescriptors_description_value?: string | number;

  createdOn?: Date | number;
  updatedOn?: Date | number;
  statusCode?: number | number;
}



export type { IProduct };
