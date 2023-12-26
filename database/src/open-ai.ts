import type { NodeRedisClientType } from './config.js';

import { Prisma } from '@prisma/client';
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { RedisVectorStore } from "langchain/vectorstores/redis";

import * as CONFIG from './config.js';


const convertToVectorDocuments = async (_products: Prisma.ProductCreateInput[]) => {
    const vectorDocs: Document[] = [];

    if (_products?.length > 0) {

        for (let product of _products) {
            let doc = new Document({
                metadata: {
                    productId: product.productId,
                },
                pageContent: ` Product details are as follows:
                productId: ${product.productId}.
    
                productDisplayName: ${product.productDisplayName}.
                
                price: ${product.price}.
    
                variantName: ${product.variantName}.
    
                brandName: ${product.brandName}.
    
                ageGroup: ${product.ageGroup}.
    
                gender: ${product.gender}.
    
                productColors: ${product.productColors}
    
                Category:  ${product.displayCategories}, ${product.masterCategory_typeName} - ${product.subCategory_typeName}
    
                productDescription:  ${product.productDescriptors_description_value}`,
            });

            vectorDocs.push(doc);
        }
    }
    return vectorDocs;
}

const seedOpenAIEmbeddings = async (vectorDocs: Document[], _redisClient: NodeRedisClientType, _openAIApiKey: string) => {

    const existingKeys = await _redisClient.keys(CONFIG.OPEN_AI_PRODUCT_KEY_PREFIX + "*");
    if (existingKeys.length > 0) {
        console.log("seeding openAIEmbeddings skipped !");
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
                indexName: CONFIG.OPEN_AI_PRODUCT_INDEX_NAME,
                keyPrefix: CONFIG.OPEN_AI_PRODUCT_KEY_PREFIX,
            }
        );
        console.log("seeding OpenAIEmbeddings completed");
    }
}

const seedHuggingFaceEmbeddings = async (vectorDocs: Document[], _redisClient: NodeRedisClientType, _huggingFaceApiKey?: string) => {

    //https://js.langchain.com/docs/integrations/text_embedding/hugging_face_inference

    const existingKeys = await _redisClient.keys(CONFIG.HUGGING_FACE_PRODUCT_KEY_PREFIX + "*");
    if (existingKeys.length > 0) {
        console.log("seeding HuggingFaceEmbeddings skipped !");
        return;
    }

    if (vectorDocs?.length && _redisClient && _huggingFaceApiKey) {
        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: _huggingFaceApiKey
        });
        const vectorStore = await RedisVectorStore.fromDocuments(
            vectorDocs,
            embeddings,
            {
                redisClient: _redisClient,
                indexName: CONFIG.HUGGING_FACE_PRODUCT_INDEX_NAME,
                keyPrefix: CONFIG.HUGGING_FACE_PRODUCT_KEY_PREFIX,
            }
        );
        console.log("seeding HuggingFaceEmbeddings completed");
    }
}

const addEmbeddingsToRedis = async (_products: Prisma.ProductCreateInput[], _redisClient: NodeRedisClientType, _openAIApiKey: string, _huggingFaceApiKey?: string) => {
    if (_products?.length > 0 && _redisClient && _openAIApiKey) {

        const vectorDocs = await convertToVectorDocuments(_products);

        await seedOpenAIEmbeddings(vectorDocs, _redisClient, _openAIApiKey);

        await seedHuggingFaceEmbeddings(vectorDocs, _redisClient, _huggingFaceApiKey);

        /**
         * Note : instead openAI embeddings, can use hugging face or other embeddings too  https://github.com/langchain-ai/langchain/blob/master/templates/rag-redis/rag_redis/chain.py
         */
    }
}

export {
    addEmbeddingsToRedis
}