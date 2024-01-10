
import * as dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import { createClient } from 'redis';

import * as CONFIG from './config.js';
import {
  addProductsToRandomStoresInRedis,
  addZipCodeDetailsInRedis,
} from './stores-inventory-data.js';
import { loadTriggers } from './triggers.js';
import { addEmbeddingsToRedis } from './open-ai.js';
import { addImageSummaryEmbeddingsToRedis } from './open-ai-image.js';
import { consoleLog } from './utils.js';
import { addProductsToDatabase } from "./products-seed.js";

dotenv.config();

const CDN_MAX_PRODUCTS_FOLDER_COUNT = 50; // 50 * 1000  products
const SEED_DB: any = {
  PRODUCTS: true,
  TRIGGERS: true,
  STORES: true,
  ZIP_CODES: true,
  PRODUCT_DETAILS_EMBEDDINGS: true,
  IMAGE_SUMMARY_EMBEDDINGS: true,
};
const totalLogSeqCount = Object.keys(SEED_DB).length;

const init = async () => {
  try {
    let products: Prisma.ProductCreateInput[] = [];
    const openAIApiKey = process.env.OPEN_AI_API_KEY;
    const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY;

    //connect prisma db and redis
    let prisma = new PrismaClient();
    const redisClient = createClient({ url: process.env.REDIS_CONNECTION_URI });
    await prisma.$connect();
    await redisClient.connect();

    // check if database is already loaded
    const checkDB = await redisClient.exists('database_loaded');
    if (checkDB === 1) {
      consoleLog('Database have been loaded, not reloading');
      return;
    }

    consoleLog(`Total database seeding steps: ${totalLogSeqCount}`);

    if (SEED_DB.PRODUCTS) {
      consoleLog('Products seeding started', true);
      products = await addProductsToDatabase(prisma, redisClient, CDN_MAX_PRODUCTS_FOLDER_COUNT);
      consoleLog('Products seeding completed');
    }
    else {
      products = await prisma.product.findMany({});
    }

    if (products?.length > 0) {
      if (SEED_DB.TRIGGERS) {
        consoleLog('loadTriggers started', true);
        await loadTriggers(redisClient);
        consoleLog('loadTriggers completed');
      }

      if (SEED_DB.STORES) {
        consoleLog('addProductsToRandomStores started', true);
        await addProductsToRandomStoresInRedis(
          products,
          CONFIG.PRODUCT_IN_MAX_STORES,
          redisClient,
        );
        consoleLog('addProductsToRandomStores completed');
      }

      if (SEED_DB.ZIP_CODES) {
        consoleLog('addZipCodeDetails started', true);
        await addZipCodeDetailsInRedis(redisClient);
        consoleLog('addZipCodeDetails completed');
      }

      if (openAIApiKey) {
        if (SEED_DB.PRODUCT_DETAILS_EMBEDDINGS) {
          consoleLog('addProductDetailsEmbeddings started', true);
          await addEmbeddingsToRedis(products, redisClient, openAIApiKey, huggingFaceApiKey);
          consoleLog('addProductDetailsEmbeddings completed');
        }

        if (SEED_DB.IMAGE_SUMMARY_EMBEDDINGS) {
          consoleLog(`addImageSummaryEmbeddings started for ${products.length} products`, true);
          await addImageSummaryEmbeddingsToRedis(products, redisClient, openAIApiKey);
          consoleLog('addImageSummaryEmbeddings completed');
        }
      }
      else {
        consoleLog('addProductDetailsEmbeddings and addImageSummaryEmbeddings are skipped as openAIApiKey is missing in .env file!');
      }

    }

    await redisClient.set('database_loaded', 'true');

    await redisClient.disconnect();
    await prisma.$disconnect();
  } catch (err) {
    console.log(err);
  }
};

init();
