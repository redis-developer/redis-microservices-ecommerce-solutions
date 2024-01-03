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
import { SERVER_CONFIG } from '../../../common/config/server-config';

import { getNodeRedisClient, AggregateSteps } from '../../../common/utils/redis/redis-wrapper';
import {
  chatBotMessage, getChatBotHistory, CHAT_CONSTANTS,
  getSimilarProductsByVSS, getSimilarProductsScoreByVSS,
  getSimilarProductsScoreByVSSImageSummary
} from './open-ai-prompt';

interface IInventoryBodyFilter {
  productDisplayName?: string;
  productId?: string;
  searchRadiusInMiles?: number;
  userLocation?: {
    latitude?: number;
    longitude?: number;
  }
}
interface IChatMessage {
  sender: string;
  message: string;
}

interface IProductsVSSBodyFilter {
  searchText?: string;
  maxProductCount?: number;
  similarityScoreLimit?: number;
  embeddingsType?: string;
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
    else if (productFilter?.productId) {
      queryBuilder = queryBuilder
        .and('productId')
        .eq(productFilter.productId)
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

  if (productFilter?.productDisplayName) {
    whereQuery.productDisplayName = {
      contains: productFilter.productDisplayName,
      mode: 'insensitive',
    };
  }
  else if (productFilter?.productId) {
    whereQuery.productId = productFilter.productId;
  }


  const products: Product[] = await prisma.product.findMany({
    where: whereQuery,
  });

  return products;
}

const triggerResetInventory = async () => {
  const redisClient = getNodeRedisClient();

  //@ts-ignore
  const result = await redisClient.sendCommand(["TFCALLASYNC", "OnDemandTriggers.resetInventory", "0"], {
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
    const radiusInMiles = _inventoryFilter.searchRadiusInMiles || 500;

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
    else if (_inventoryFilter.productId) {
      queryBuilder = queryBuilder
        .and('productId')
        .eq(_inventoryFilter.productId)
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
        LOAD: ["@storeId", "@storeName", "@storeLocation", "@productId", "@productDisplayName", "@stockQty"],
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
          "LOAD" "5" "@storeId" "@storeName" "@storeLocation" "@productId" "@productDisplayName" "@stockQty"
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
    let generalProducts = <IProduct | IProduct[]>await repository.fetch(...productIds);
    if (!Array.isArray(generalProducts)) {
      generalProducts = [generalProducts];
    }

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

const chatBot = async (_userMessage: string, _sessionId: string) => {
  let answer = "";

  if (_userMessage && _sessionId) {
    const openAIApiKey = process.env.OPEN_AI_API_KEY;
    if (openAIApiKey) {
      answer = await chatBotMessage(_userMessage, _sessionId, openAIApiKey);
    }
    else {
      answer = "Please provide openAI API key in .env file";
    }
  }
  else {
    throw new Error("No user message or session id provided");
  }

  return answer;
}
const getChatHistory = async (_sessionId: string) => {
  let chatMessages: IChatMessage[] = [];

  if (_sessionId) {
    const historyArr = await getChatBotHistory(_sessionId);

    if (historyArr?.length) {
      historyArr.forEach((item) => {
        let sender = "";
        let message = "";
        if (item.startsWith(CHAT_CONSTANTS.userMessagePrefix)) {
          sender = CHAT_CONSTANTS.senderUser;
          message = item.replace(CHAT_CONSTANTS.userMessagePrefix, "");
        }
        else if (item.startsWith(CHAT_CONSTANTS.openAIMessagePrefix)) {
          sender = CHAT_CONSTANTS.senderAssistant;
          message = item.replace(CHAT_CONSTANTS.openAIMessagePrefix, "");
        }

        chatMessages.push({
          sender: sender,
          message: message
        })
      });
    }
  }
  else {
    throw new Error("No session id provided");
  }

  return chatMessages;
}

const getProductByIds = async (productIds: string[], isActiveQty: boolean) => {
  let products: IProduct | IProduct[] = [];

  if (productIds?.length) {
    const repository = ProductRepo.getRepository();
    products = <IProduct | IProduct[]>await repository.fetch(...productIds);
    if (!Array.isArray(products)) {
      products = [products];
    }
    if (isActiveQty) {
      products = products.filter(prod => prod?.statusCode === DB_ROW_STATUS.ACTIVE && prod?.stockQty > 0);
    }

    //return products in  order of productIds
    products.sort((prod1, prod2) => {
      return productIds.indexOf(prod1.productId) - productIds.indexOf(prod2.productId);
    });

  }
  return products;
}

const getProductsByVSSText = async (productsVSSFilter: IProductsVSSBodyFilter) => {
  let { searchText, maxProductCount, similarityScoreLimit, embeddingsType } = productsVSSFilter;
  let products: IProduct[] = [];

  const openAIApiKey = process.env.OPEN_AI_API_KEY || "";
  const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY || "";
  const VSS_EMBEDDINGS_TYPE = SERVER_CONFIG.PRODUCTS_SERVICE.VSS_EMBEDDINGS_TYPE;
  maxProductCount = maxProductCount || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;
  similarityScoreLimit = similarityScoreLimit || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_SCORE_LIMIT;
  embeddingsType = embeddingsType || VSS_EMBEDDINGS_TYPE.OPEN_AI;

  if (embeddingsType === VSS_EMBEDDINGS_TYPE.OPEN_AI && !openAIApiKey) {
    throw new Error("Please provide openAI API key in .env file");
  }
  else if (embeddingsType === VSS_EMBEDDINGS_TYPE.HUGGING_FACE && !huggingFaceApiKey) {
    throw new Error("Please provide huggingFace API key in .env file");
  }

  if (!searchText) {
    throw new Error("Please provide search text");
  }

  //VSS search
  const vectorDocs = await getSimilarProductsScoreByVSS({
    standAloneQuestion: searchText,
    openAIApiKey: openAIApiKey,
    huggingFaceApiKey: huggingFaceApiKey,
    KNN: maxProductCount,
    scoreLimit: similarityScoreLimit,
    embeddingsType: embeddingsType
  });

  if (vectorDocs?.length) {
    const productIds = vectorDocs.map(doc => doc?.metadata?.productId);

    //get product with details
    products = await getProductByIds(productIds, true);
  }

  //add similarityScore to products
  if (products?.length) {
    products = products.map(prod => {
      const matchingDoc = vectorDocs.find(doc => doc?.metadata?.productId === prod.productId);
      if (matchingDoc) {
        prod["similarityScore"] = matchingDoc["similarityScore"];
      }
      return prod;
    });
  }

  return products;
}

const getProductsByVSSImageSummary = async (productsVSSFilter: IProductsVSSBodyFilter) => {
  let { searchText, maxProductCount, similarityScoreLimit } = productsVSSFilter;
  let products: IProduct[] = [];

  const openAIApiKey = process.env.OPEN_AI_API_KEY || "";
  maxProductCount = maxProductCount || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;
  similarityScoreLimit = similarityScoreLimit || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_SCORE_LIMIT;

  if (!openAIApiKey) {
    throw new Error("Please provide openAI API key in .env file");
  }

  if (!searchText) {
    throw new Error("Please provide search text");
  }

  //VSS search
  const vectorDocs = await getSimilarProductsScoreByVSSImageSummary({
    standAloneQuestion: searchText,
    openAIApiKey: openAIApiKey,
    KNN: maxProductCount,
    scoreLimit: similarityScoreLimit,
  });

  if (vectorDocs?.length) {
    const productIds = vectorDocs.map(doc => doc?.metadata?.productId);

    //get product with details
    products = await getProductByIds(productIds, true);
  }

  //add similarityScore to products
  if (products?.length) {
    products = products.map(prod => {
      const matchingDoc = vectorDocs.find(doc => doc?.metadata?.productId === prod.productId);
      if (matchingDoc) {
        prod["similarityScore"] = matchingDoc["similarityScore"];
      }
      return prod;
    });
  }

  return products;
}

export {
  getProductsByFilter,
  getProductsByFilterFromDB,
  triggerResetInventory,
  getZipCodes,
  getStoreProductsByGeoFilter,
  chatBot,
  getChatHistory,
  getProductsByVSSText,
  getProductsByVSSImageSummary
};
