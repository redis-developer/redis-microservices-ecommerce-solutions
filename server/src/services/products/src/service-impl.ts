import type { Product } from '@prisma/client';
import type { IProduct } from '../../../common/models/product';
import type { IZipCode } from '../../../common/models/zip-code';
import type { IStoreInventory, IStoreProduct } from '../../../common/models/store-inventory';

import { Prisma } from '@prisma/client';

import { DB_ROW_STATUS } from '../../../common/models/order';
import { getPrismaClient } from '../../../common/utils/prisma/prisma-wrapper';
import * as ProductRepo from '../../../common/models/product-repo';
import * as ZipCodeRepo from '../../../common/models/zip-code-repo';
import * as StoreInventoryRepo from '../../../common/models/store-inventory-repo';

import { getNodeRedisClient, AggregateSteps } from '../../../common/utils/redis/redis-wrapper';

interface IInventoryBodyFilter {
  productDisplayName?: string;
  searchRadiusInMiles?: number;
  userLocation?: {
    latitude?: number;
    longitude?: number;
  }
}

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

    if (productFilter?.productDisplayName) {
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
    zipCodes = <IZipCode[]>await queryBuilder.sortAsc("zipCode").return.all();
  }

  return zipCodes;
};


const searchStoreInventoryByGeoFilter = async (_inventoryFilter: IInventoryBodyFilter) => {
  const redisClient = getNodeRedisClient();
  const repository = StoreInventoryRepo.getRepository();
  let storeProducts: IStoreInventory[] = [];
  const trimmedStoreProducts: IStoreInventory[] = [] // similar item of other stores are removed
  const uniqueProductIds = {};

  if (repository
    && _inventoryFilter?.userLocation?.latitude
    && _inventoryFilter?.userLocation?.longitude) {

    const lat = _inventoryFilter.userLocation.latitude;
    const long = _inventoryFilter.userLocation.longitude;
    const radiusInMiles = _inventoryFilter.searchRadiusInMiles || 50;

    let queryBuilder = repository
      .search()
      .and('statusCode')
      .eq(DB_ROW_STATUS.ACTIVE)
      .and('stockQty')
      .gt(0)
      .and('storeLocation')
      .inRadius((circle) => {
        return circle
          .latitude(lat)
          .longitude(long)
          .radius(radiusInMiles)
          .miles
      });;

    if (_inventoryFilter.productDisplayName) {
      queryBuilder = queryBuilder
        .and('productDisplayName')
        .matches(_inventoryFilter.productDisplayName)
    }

    console.log(queryBuilder.query);

    /* Sample queryBuilder.query to run on CLI
    FT.SEARCH "storeInventory:storeInventoryId:index" "( ( ( (@statusCode:[1 1]) (@stockQty:[(0 +inf]) ) (@storeLocation:[-73.968285 40.785091 50 mi]) ) (@productDisplayName:'puma') )"
            */

    const indexName = `${StoreInventoryRepo.STORE_INVENTORY_KEY_PREFIX}:index`;
    const aggregator = await redisClient.ft.aggregate(
      indexName,
      queryBuilder.query,
      {
        LOAD: ["@storeId", "@storeLocation", "@productId", "@productDisplayName", "@stockQty"],
        STEPS: [{
          type: AggregateSteps.APPLY,
          expression: `geodistance(@storeLocation, ${long}, ${lat})/${radiusInMiles}`,
          AS: 'distInMiles'
        }, {
          type: AggregateSteps.SORTBY,
          BY: ["@distInMiles", "@productId"]
        }, {
          type: AggregateSteps.LIMIT,
          from: 0,
          size: 1000, //must be > storeInventory count
        }]
      });

    /* Sample command to run on CLI
        FT.AGGREGATE "storeInventory:storeInventoryId:index"
          "( ( ( (@statusCode:[1 1]) (@stockQty:[(0 +inf]) ) (@storeLocation:[-73.968285 40.785091 1000 km]) ) (@productDisplayName:'puma') )"
          "LOAD" "5" "@storeId" "@storeLocation" "@productId" "@productDisplayName" "@stockQty"
          "APPLY" "geodistance(@storeLocation, -73.968285, 40.785091)/1000"
          "AS" "distInMiles"
          "SORTBY" "1" "@distInMiles"
          "LIMIT" "0" "100"
    */

    storeProducts = <IStoreInventory[]>aggregator.results;

    if (!storeProducts.length) {
      // throw `Product not found with in ${radiusInKm}km range!`;
    }
    else {

      storeProducts.forEach((storeProduct) => {
        if (storeProduct?.productId && !uniqueProductIds[storeProduct.productId]) {
          uniqueProductIds[storeProduct.productId] = true;

          if (typeof storeProduct.storeLocation == "string") {
            const location = storeProduct.storeLocation.split(",");
            storeProduct.storeLocation = {
              longitude: Number(location[0]),
              latitude: Number(location[1]),
            }
          }

          trimmedStoreProducts.push(storeProduct)
        }
      });
    }
  }
  else {
    throw "Mandatory fields like userLocation latitude / longitude missing !"
  }

  return {
    storeProducts: trimmedStoreProducts,
    productIds: Object.keys(uniqueProductIds)
  };
};
const getStoreProductsByGeoFilter = async (_inventoryFilter: IInventoryBodyFilter) => {
  let products: IStoreProduct[] = [];

  const { storeProducts, productIds } = await searchStoreInventoryByGeoFilter(_inventoryFilter);

  if (storeProducts?.length && productIds?.length) {
    const repository = ProductRepo.getRepository();
    //products with details
    const generalProducts = <IProduct[]>await repository.fetch(...productIds);
    //mergedProducts
    products = storeProducts.map(storeProd => {
      const matchingGeneralProd = generalProducts.find(generalProd => generalProd.productId === storeProd.productId);
      //@ts-ignore
      const mergedProd: IStoreProduct = { ...matchingGeneralProd, ...storeProd };
      return mergedProd;
    });
  }


  return products;
};

export {
  getProductsByFilter,
  getProductsByFilterFromDB,
  triggerResetInventory,
  getZipCodes,
  getStoreProductsByGeoFilter
};
