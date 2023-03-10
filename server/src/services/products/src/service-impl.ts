import type { IProduct } from '../../../common/models/product';
import type { Document } from '../../../common/utils/mongodb/node-mongo-wrapper';

import { DB_ROW_STATUS } from '../../../common/models/order';
import { COLLECTIONS } from '../../../common/config/server-config';
import { MAX_DOCUMENTS_FETCH_LIMIT } from '../../../common/config/constants';
import { getMongodb } from '../../../common/utils/mongodb/node-mongo-wrapper';

interface IProductFilter {
  productDisplayName: string;
}

async function getProductsByFilter(productFilter: IProductFilter) {
  const mongodbWrapperInst = getMongodb();
  const filter: Document = {
    statusCode: {
      $eq: DB_ROW_STATUS.ACTIVE,
    },
  };

  if (productFilter && productFilter.productDisplayName) {
    filter['data.productDisplayName'] = {
      $regex: productFilter.productDisplayName,
      $options: 'i',
    };
  }

  const projection: IProduct = {
    productId: 1,
    data: {
      id: 1,
      price: 1,
      productDisplayName: 1,
      variantName: 1,
      brandName: 1,
      ageGroup: 1,
      gender: 1,
      displayCategories: 1,
      styleImages: {
        default: {
          imageURL: 1,
        },
      },
      productDescriptors: {
        description: {
          value: 1,
        },
      },
    },
  };

  const limit = MAX_DOCUMENTS_FETCH_LIMIT;
  const sort = {};
  const products = await mongodbWrapperInst.find(
    COLLECTIONS.PRODUCTS.collectionName,
    filter,
    projection,
    limit,
    sort,
  );
  return products;
}

export { getProductsByFilter };
