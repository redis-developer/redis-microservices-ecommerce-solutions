import type { Product } from '@prisma/client';
import type { IProduct } from '../../../common/models/product';
import type { IZipCode } from '../../../common/models/zip-code';

import { Prisma } from '@prisma/client';

import { DB_ROW_STATUS } from '../../../common/models/order';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';
import * as ProductRepo from '../../../common/models/product-repo';
import * as ZipCodeRepo from '../../../common/models/zip-code-repo';

import { getNodeRedisClient } from '../../../common/utils/redis/redis-wrapper';

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

const triggerResetInventory = async () => {
  const redisClient = getNodeRedisClient();

  //@ts-ignore
  const result = await redisClient.sendCommand(["TFCALLASYNC", "ManualTriggers.resetInventory", "0"], {
    isolated: true
  });
  console.log(`triggerResetInventory :  `, result);

  return result;
}

const getZipCodes = async () => {
  const repository = ZipCodeRepo.getRepository();
  let zipCodes: IZipCode[] = [];
  if (repository) {
    let queryBuilder = repository
      .search()
      .and('statusCode')
      .eq(DB_ROW_STATUS.ACTIVE);

    console.log(queryBuilder.query);
    zipCodes = <IZipCode[]>await queryBuilder.return.all();
  }

  return zipCodes;
};

export {
  getProductsByFilter,
  getProductsByFilterFromDB,
  triggerResetInventory,
  getZipCodes
};
