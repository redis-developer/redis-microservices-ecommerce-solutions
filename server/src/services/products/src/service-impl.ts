import type { Product } from '@prisma/client';
import type { IProduct } from '../../../common/models/product';

import { Prisma } from '@prisma/client';

import { DB_ROW_STATUS } from '../../../common/models/order';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';
import * as ProductRepo from '../../../common/models/product-repo';

const getProductsByFilter = async (productFilter: Product) => {
  const repository = ProductRepo.getRepository();
  let products: IProduct[] = [];
  if (repository) {
    let queryBuilder = repository
      .search()
      .and('statusCode')
      .eq(DB_ROW_STATUS.ACTIVE)
      .and('stockQty')
      .gt(0);

    if (productFilter && productFilter.productDisplayName) {
      queryBuilder = queryBuilder
        .and('productDisplayName')
        .matches(productFilter.productDisplayName)
    }

    console.log(queryBuilder.query);
    products = <IProduct[]>await queryBuilder.sortAsc("productId").return.all();
  }

  return products;
};

async function getProductsByFilterFromDB(productFilter: Product) {
  const prisma = getPrismaClient();

  const whereQuery: Prisma.ProductWhereInput = {
    statusCode: DB_ROW_STATUS.ACTIVE,
    stockQty: {
      gt: 0
    }
  };

  if (productFilter && productFilter.productDisplayName) {
    whereQuery.productDisplayName = {
      contains: productFilter.productDisplayName,
      mode: 'insensitive',
    };
  }

  const products: Product[] = await prisma.product.findMany({
    where: whereQuery,
  });

  return products;
}

export { getProductsByFilter, getProductsByFilterFromDB };
