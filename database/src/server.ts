import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient, Prisma } from '@prisma/client';

dotenv.config();

const seedPrismaDatabase = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const productJSONFolder = __dirname + '/../fashion-dataset/001/products';

  let prisma = new PrismaClient();

  //connect database
  await prisma.$connect();

  //delete products
  console.log('-----delete existing products-----');
  await prisma.product.deleteMany({});

  //get file list from directory
  const allFilesInDir = await fs.readdir(productJSONFolder);
  let jsonFilesInDir = allFilesInDir.filter(
    (file) => path.extname(file) === '.json',
  );

  console.log('-----Seeding started-----');
  jsonFilesInDir.forEach(async (file) => {
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
      await prisma.product.create({
        data: product,
      });
    } catch (err) {
      console.log(`${filePath} insertion failed `, err);
    }
  });
  console.log('-----Seeding completed-----');

  await prisma.$disconnect();
};

seedPrismaDatabase();
