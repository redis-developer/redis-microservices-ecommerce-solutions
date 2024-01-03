import type { NodeRedisClientType } from './config.js';

import * as fs from "node:fs/promises";
import { Prisma } from '@prisma/client';
import { ChatOpenAI, ChatOpenAICallOptions } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import axios from 'axios';

import * as CONFIG from './config.js';

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

const fetchImageAndConvertToBase64 = async (_imageURL: string) => {
    let base64Image = '';
    try {
        const response = await axios.get(_imageURL, {
            responseType: 'arraybuffer'
        });

        // Convert image to Base64
        base64Image = Buffer.from(response.data, 'binary').toString('base64');

    } catch (error) {
        console.error(`Error fetching or converting the image: ${_imageURL}`, error);
    }
    return base64Image;

}


const getOpenAIImageSummary = async (_openAIApiKey: string, _base64Image: string) => {
    /*
     Reference : https://js.langchain.com/docs/integrations/chat/openai#multimodal-messages
   */
    let imageSummary = '';

    if (_openAIApiKey && _base64Image) {

        const llmInst = getOpenAIVisionInstance(_openAIApiKey);

        const imagePromptMessage = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: "Summarize the contents of this image.",
                    //text: "Provide a detailed analysis of the image.",
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${_base64Image}`,
                        detail: "low",
                        //detail: "high", //  if you want more detail
                    },
                },
            ],
        });

        const response = await llmInst.invoke([imagePromptMessage]);
        //console.log({ response });
        if (response?.content) {
            imageSummary = <string>response.content;
        }

    }
    return imageSummary;

}

const getImageSummaryVectorDocuments = async (_products: Prisma.ProductCreateInput[], _openAIApiKey: string) => {
    const vectorDocs: Document[] = [];

    if (_products?.length > 0) {
        let count = 1;
        for (let product of _products) {
            if (product) {
                let imageURL = product.styleImages_default_imageURL; //cdn url
                imageURL = imageURL.replace("host.docker.internal", "localhost");
                const imageData = await fetchImageAndConvertToBase64(imageURL);
                const imageSummary = await getOpenAIImageSummary(_openAIApiKey, imageData);
                console.log(`openAI imageSummary #${count++} generated for product id: ${product.productId}`);

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
    return vectorDocs;
}

const seedImageSummaryEmbeddings = async (vectorDocs: Document[], _redisClient: NodeRedisClientType, _openAIApiKey: string) => {

    const existingKeys = await _redisClient.keys(CONFIG.OPEN_AI_PRODUCT_IMG_TEXT_KEY_PREFIX + "*");
    if (existingKeys.length > 0) {
        console.log("seeding imageSummaryEmbeddings skipped !");
        return;
    }

    if (vectorDocs?.length && _redisClient && _openAIApiKey) {
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