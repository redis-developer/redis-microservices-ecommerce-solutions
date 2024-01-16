import type { NodeRedisClientType } from './config.js';

import * as fs from "node:fs/promises";
import { Prisma } from '@prisma/client';
import { ChatOpenAI, ChatOpenAICallOptions } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";

import * as CONFIG from './config.js';
import {
    fetchFileData, fetchImageAndConvertToBase64,
    deleteExistingKeysInRedis
} from './utils.js';
import path from 'node:path';


let llm: ChatOpenAI<ChatOpenAICallOptions>;

const getOpenAIVisionInstance = (_openAIApiKey: string) => {
    //OpenAI supports  images with text in input messages with their gpt-4-vision-preview. 
    if (!llm) {
        llm = new ChatOpenAI({
            openAIApiKey: _openAIApiKey,
            modelName: "gpt-4-vision-preview",
            maxTokens: 1024,
        })
    }
    return llm;
}

const getOpenAIImageSummary = async (_openAIApiKey: string, _base64Image: string, _product: Prisma.ProductCreateInput) => {
    /*
     Reference : https://js.langchain.com/docs/integrations/chat/openai#multimodal-messages

      - This function utilizes OpenAI's multimodal capabilities to generate a summary from the image. 
      - It constructs a prompt that combines the product description with the image.
      - OpenAI's vision model then processes this prompt to generate a detailed summary.
   */
    let imageSummary = '';

    try {

        if (_openAIApiKey && _base64Image && _product) {

            const llmInst = getOpenAIVisionInstance(_openAIApiKey);

            const text = `Below are the product details and image of an e-commerce product for reference. Please conduct and provide a comprehensive analysis of the product depicted in the image . 
        
            Product Details:
            ${_product.productDescriptors_description_value}
            
            Image:
        `;
            // Constructing a multimodal message combining text and image
            const imagePromptMessage = new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: text,
                        //text: "Summarize the contents of this image.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${_base64Image}`,
                            detail: "high", // low, high (if you want more detail)
                        },
                    },
                ],
            });

            // Invoking the LangChain ChatOpenAI model with the constructed message
            const response = await llmInst.invoke([imagePromptMessage]);
            //console.log({ response });
            if (response?.content) {
                imageSummary = <string>response.content;
            }

        }
    }
    catch (err) {
        console.log(`Error generating OpenAIImageSummary for product id ${_product.productId}`, err);
    }
    return imageSummary;

}

const getExistingImageSummary = async (_imagePath: string) => {
    let imageSummary = '';

    if (_imagePath) {
        try {
            const remoteFilePath = _imagePath.replace(".webp", ".txt");
            imageSummary = await fetchFileData(remoteFilePath);
        }
        catch (err) {
        }

    }
    return imageSummary;
}

const writeImageSummaryToFile = async (_imagePath: string, _imageSummary: string) => {
    // later, copy all the generated files to the cdn/fashion-dataset/ manually
    if (_imagePath && _imageSummary) {
        try {
            let summaryFilePath = _imagePath.replace(".webp", ".txt");

            summaryFilePath = summaryFilePath.split(`:${process.env.CDN_PORT}`)[1];

            summaryFilePath = "./generated-img-summary" + summaryFilePath;
            console.log(`writing imageSummary to file: ${summaryFilePath}`);

            const dir = path.dirname(summaryFilePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(summaryFilePath, _imageSummary);
        }
        catch (err) {
        }

    }
}


const getImageSummaryVectorDocuments = async (_products: Prisma.ProductCreateInput[], _openAIApiKey: string) => {
    /*
        - Image summary is seeded from file only (if exists) else skipped
        - To generate openAI image summary for new products
            - Copy new products to cdn/fashion-dataset/products/ folder
            - Copy .env to database/.env  and update CDN_HOST_DEBUG=localhost
            - Start all services & then again database service locally like 'cd database && npm start' 
            - Image summary files will be generated in database/generated-img-summary folder
            - Copy all the generated files to the cdn/fashion-dataset/ manually 
    */

    const vectorDocs: Document[] = [];

    if (_products?.length > 0) {
        let count = 1;
        for (let product of _products) {
            if (product) {
                let imageURL = product.styleImages_default_imageURL; //cdn url

                const debugModeHost = process.env.CDN_HOST_DEBUG; //localhost
                if (debugModeHost) {
                    imageURL = imageURL.replace("host.docker.internal", debugModeHost);
                }

                let imageSummary = await getExistingImageSummary(imageURL);

                if (imageSummary) {
                    console.log(`imageSummary #${count++} fetched from file for product id: ${product.productId}`);
                }
                else if (!imageSummary && debugModeHost) {
                    const imageData = await fetchImageAndConvertToBase64(imageURL);
                    imageSummary = await getOpenAIImageSummary(_openAIApiKey, imageData, product);
                    console.log(`openAI imageSummary #${count++} generated for product id: ${product.productId}`);

                    await writeImageSummaryToFile(imageURL, imageSummary);

                }
                else {
                    console.log(`openAI imageSummary #${count++} skipped for product id: ${product.productId}`);
                }

                if (imageSummary) {
                    let doc = new Document({
                        metadata: {
                            productId: product.productId,
                            imageURL: imageURL,
                        },
                        pageContent: imageSummary,
                    });
                    vectorDocs.push(doc);
                }
            }
        }
    }
    return vectorDocs;
}

const seedImageSummaryEmbeddings = async (vectorDocs: Document[], _redisClient: NodeRedisClientType, _openAIApiKey: string) => {

    if (vectorDocs?.length && _redisClient && _openAIApiKey) {
        await deleteExistingKeysInRedis(CONFIG.OPEN_AI_PRODUCT_IMG_TEXT_KEY_PREFIX, _redisClient);

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: _openAIApiKey
        });
        const vectorStore = await RedisVectorStore.fromDocuments(
            vectorDocs,
            embeddings,
            {
                redisClient: _redisClient,
                indexName: CONFIG.OPEN_AI_PRODUCT_IMG_TEXT_INDEX_NAME,
                keyPrefix: CONFIG.OPEN_AI_PRODUCT_IMG_TEXT_KEY_PREFIX,
            }
        );
        console.log("seeding imageSummaryEmbeddings completed");
    }
}


const addImageSummaryEmbeddingsToRedis = async (_products: Prisma.ProductCreateInput[], _redisClient: NodeRedisClientType, _openAIApiKey: string) => {

    const vectorDocs = await getImageSummaryVectorDocuments(_products, _openAIApiKey);

    await seedImageSummaryEmbeddings(vectorDocs, _redisClient, _openAIApiKey);

}

export {
    addImageSummaryEmbeddingsToRedis
}