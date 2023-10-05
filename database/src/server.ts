import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient, Prisma } from '@prisma/client';
import { createClient } from 'redis';

type NodeRedisClientType = ReturnType<typeof createClient>;

const PRODUCT_KEY_PREFIX = 'products:productId';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedPrismaAndRedisDatabase = async (prisma: PrismaClient, redisClient: NodeRedisClientType) => {

  const productJSONFolder = __dirname + '/../fashion-dataset/001/products';

  //delete products
  console.log('-----PrismaDB: delete existing products-----');
  await prisma.product.deleteMany({});

  //get file list from directory
  const allFilesInDir = await fs.readdir(productJSONFolder);
  let jsonFilesInDir = allFilesInDir.filter(
    (file) => path.extname(file) === '.json',
  );

  console.log('-----Seeding started-----');

  const DEFAULT_QTY = 25; //also in triggers/manual-trigger.js

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
        stockQty: DEFAULT_QTY,

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
      };

      //insert product to database
      const insertedProduct = await prisma.product.create({
        data: product,
      });

      if (redisClient) {
        // insert product to Redis
        const productKey = PRODUCT_KEY_PREFIX + ':' + insertedProduct.productId;
        await redisClient.json.set(productKey, '.', insertedProduct);
      }

    } catch (err) {
      console.log(`${filePath} insertion failed `, err);
    }
  }
  console.log('-----Seeding completed-----');

};

const addTriggersToRedis = async (redisClient: NodeRedisClientType, fileRelativePath: string) => {

  const filePath = path.join(__dirname, fileRelativePath);
  const fileData = await fs.readFile(filePath);
  let jsCode = fileData.toString();
  jsCode = jsCode.replace(/\r?\n/g, '\n');

  try {
    const result = await redisClient.sendCommand(["TFUNCTION", "LOAD", "REPLACE", jsCode])
    console.log(`addTriggersToRedis ${fileRelativePath}`, result);
  }
  catch (err) {
    console.log(err);
  }
}


const init = async () => {
  try {
    let prisma = new PrismaClient();
    const redisClient = createClient({ url: process.env.REDIS_CONNECTION_URI });

    await prisma.$connect(); //connect db
    await redisClient.connect();

    await seedPrismaAndRedisDatabase(prisma, redisClient);

    await addTriggersToRedis(redisClient, 'triggers/key-space-triggers.js');
    await addTriggersToRedis(redisClient, 'triggers/key-space-triggers-manual-test.js');

    await addTriggersToRedis(redisClient, 'triggers/manual-trigger.js');

    await redisClient.disconnect();
    await prisma.$disconnect();
  }
  catch (err) {
    console.log(err);
  }

};

init();