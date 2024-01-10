import type { NodeRedisClientType } from './config.js';

import { PrismaClient, Prisma } from '@prisma/client';

import { consoleLog, fetchZipFileJSON, fetchFileData } from './utils.js';
import * as CONFIG from './config.js';
import {
    deleteExistingKeysInRedis
} from './stores-inventory-data.js';


const addProductToPrismaDBAndRedis = async (
    prisma: PrismaClient,
    redisClient: NodeRedisClientType,
    json: any,
    imageSuffixPath: string) => {

    let product: Prisma.ProductCreateInput | null = null;

    if (prisma && redisClient && json && imageSuffixPath) {

        product = {
            //custom
            productId: json.productId,
            styleImages_default_imageURL: `http://${process.env.CDN_HOST}:${process.env.CDN_PORT}/${imageSuffixPath}`,
            createdBy: 'ADMIN',
            stockQty: CONFIG.DEFAULT_PRODUCT_QTY,

            //from json
            price: Number(json.price),
            productDisplayName: json.productDisplayName,
            variantName: json.variantName || "",
            brandName: json.brandName || "",
            ageGroup: json.ageGroup || "",
            gender: json.gender || "",
            displayCategories: json.displayCategories || "",
            masterCategory_typeName: json.masterCategory_typeName || "",
            subCategory_typeName: json.subCategory_typeName || "",
            productDescriptors_description_value:
                json.productDescriptors_description_value || "",
            productColors: json.productColors || ""
            //TODO: add season, usage fields in DB
        };

        //insert product to prisma database
        const insertedProduct = await prisma.product.create({
            data: product,
        });

        if (redisClient) {
            // insert product to Redis
            const productKey =
                CONFIG.PRODUCT_KEY_PREFIX + ':' + insertedProduct.productId;
            await redisClient.json.set(productKey, '.', insertedProduct);
        }
    }

    return product;
}

const addProductsToDatabase = async (
    prisma: PrismaClient,
    redisClient: NodeRedisClientType,
    cdnProductsFolderCount: number
) => {
    //delete existing products
    consoleLog('Deleting existing products (if any)');
    await prisma.product.deleteMany({});
    await deleteExistingKeysInRedis(CONFIG.PRODUCT_KEY_PREFIX, redisClient);

    const FIXED_IMG_NAME = 'product-img.webp';
    const FIXED_JSON_GZ_NAME = 'product-data.json.gz';
    const folderCountLoopArr = Array(cdnProductsFolderCount).keys();
    const products: Prisma.ProductCreateInput[] = [];

    try {
        // loop folder count
        for (let i of folderCountLoopArr) { //for-of loop for async await
            const folderNum = (i + 1).toString().padStart(2, '0');

            console.log(`CDN_HOST_DEBUG: ${process.env.CDN_HOST_DEBUG}, CDN_HOST: ${process.env.CDN_HOST}`);
            const localHost = process.env.CDN_HOST_DEBUG || process.env.CDN_HOST;
            const remoteURLPrefix = `http://${localHost}:${process.env.CDN_PORT}`;

            const remoteURLProductList = `${remoteURLPrefix}/products/${folderNum}/products-list.txt`;
            console.log(remoteURLProductList);

            const productPathData = await fetchFileData(remoteURLProductList);
            if (productPathData) {
                const productPathArr = productPathData.split('\n');

                // loop products in folder
                for (let productPath of productPathArr) {
                    const remoteURLProduct = `${remoteURLPrefix}/${productPath}/${FIXED_JSON_GZ_NAME}`;
                    console.log(remoteURLProduct);

                    // fetch product json
                    const json = await fetchZipFileJSON(remoteURLProduct);
                    if (json) {
                        const imageSuffixPath = `${productPath}/${FIXED_IMG_NAME}`;
                        const product = await addProductToPrismaDBAndRedis(prisma, redisClient, json, imageSuffixPath);
                        if (product) {
                            products.push(product);
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    return products;
}

export {
    addProductsToDatabase
}