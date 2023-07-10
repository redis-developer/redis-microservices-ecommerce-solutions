import type { Product } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { DB_ROW_STATUS } from '../../../common/models/order';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';

async function getProductsByFilter(productFilter: Product) {
  const prisma = getPrismaClient();

  const whereQuery: Prisma.ProductWhereInput = {
    statusCode: DB_ROW_STATUS.ACTIVE,
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

export { getProductsByFilter };
