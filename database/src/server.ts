import type { NodeRedisClientType } from './config.js';

import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
//import { fileURLToPath } from 'url';
import { PrismaClient, Prisma } from '@prisma/client';
import { createClient } from 'redis';

import * as CONFIG from './config.js';
import {
  deleteExistingKeysInRedis,
  addProductsToRandomStoresInRedis,
  addZipCodeDetailsInRedis,
} from './stores-inventory-data.js';
import { loadTriggers } from './triggers.js';
import { addOpenAIEmbeddingsToRedis } from './open-ai.js';

dotenv.config();

const addProductsToRedisAndPrismaDB = async (
  prisma: PrismaClient,
  redisClient: NodeRedisClientType,
) => {
  console.log('-----PrismaDB: checking if products have been loaded-----');
  const checkDB = await redisClient.exists('products_loaded');

  if (checkDB === 1) {
    console.log('-----PrismaDB: products have been loaded, not reloading-----');

    return;
  }

  const products: Prisma.ProductCreateInput[] = [];
  const productJSONFolder = __dirname + '/../fashion-dataset/001/products';

  //delete products
  console.log('-----PrismaDB: delete existing products-----');
  await prisma.product.deleteMany({});
  await deleteExistingKeysInRedis(CONFIG.PRODUCT_KEY_PREFIX, redisClient);

  //get file list from directory
  const allFilesInDir = await fs.readdir(productJSONFolder);
  let jsonFilesInDir = allFilesInDir.filter(
    (file) => path.extname(file) === '.json',
  );

  console.log('-----Products seeding started-----');

  for (let file of jsonFilesInDir) {
    const filePath = path.join(productJSONFolder, file);

    try {
      //read file data
      const fileData = await fs.readFile(filePath);
      let json = JSON.parse(fileData.toString());
      json = json.data;

      let product: Prisma.ProductCreateInput = {
        //custom
        productId: json.id.toString(),
        styleImages_default_imageURL: `http://${process.env.CDN_HOST}:${process.env.CDN_PORT}/images/${json.id}.jpg`,
        createdBy: 'ADMIN',
        stockQty: CONFIG.DEFAULT_PRODUCT_QTY,

        //from json
        price: Number(json.price),
        productDisplayName: json.productDisplayName,
        variantName: json.variantName,
        brandName: json.brandName,
        ageGroup: json.ageGroup,
        gender: json.gender,
        displayCategories: json.displayCategories,
        masterCategory_typeName: json.masterCategory?.typeName, //flat json to support multiple databases
        subCategory_typeName: json.subCategory?.typeName,
        productDescriptors_description_value:
          json.productDescriptors?.description?.value,
        productColors: json.baseColour + ',' + json.colour1
      };

      //insert product to database
      const insertedProduct = await prisma.product.create({
        data: product,
      });

      if (redisClient) {
        // insert product to Redis
        const productKey =
          CONFIG.PRODUCT_KEY_PREFIX + ':' + insertedProduct.productId;
        await redisClient.json.set(productKey, '.', insertedProduct);
      }
      products.push(product);
    } catch (err) {
      console.log(`${filePath} insertion failed `, err);
    }
  }
  console.log('-----Products seeding completed-----');
  return products;
};

const init = async () => {
  try {
    const MY_OPEN_AI_API_KEY = process.env.MY_OPEN_AI_API_KEY;
    let prisma = new PrismaClient();
    const redisClient = createClient({ url: process.env.REDIS_CONNECTION_URI });

    await prisma.$connect(); //connect db
    await redisClient.connect();

    const products = await addProductsToRedisAndPrismaDB(prisma, redisClient);

    await loadTriggers(redisClient);

    if (products) {
      await addProductsToRandomStoresInRedis(
        products,
        CONFIG.PRODUCT_IN_MAX_STORES,
        redisClient,
      );

      await addZipCodeDetailsInRedis(redisClient);

      await redisClient.set('products_loaded', 'true');
    }
    if (MY_OPEN_AI_API_KEY && products) {
      await addOpenAIEmbeddingsToRedis(products, redisClient, MY_OPEN_AI_API_KEY);
    }

    await redisClient.disconnect();
    await prisma.$disconnect();
  } catch (err) {
    console.log(err);
  }
};

init();
