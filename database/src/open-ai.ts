import type { NodeRedisClientType } from './config.js';

import { Prisma } from '@prisma/client';
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";

import * as CONFIG from './config.js';

const addOpenAIEmbeddingsToRedis = async (_products: Prisma.ProductCreateInput[], _redisClient: NodeRedisClientType, _openAIApiKey: string) => {
    if (_products?.length > 0 && _redisClient && _openAIApiKey) {

        const existingKeys = await _redisClient.keys(CONFIG.OPEN_AI_PRODUCT_KEY_PREFIX + "*");
        if (existingKeys.length > 0) {
            console.log("seeding openAIEmbeddings skipped !");
            return;
        }

        const vectorDocs: Document[] = [];

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

        /**
         * Note : instead openAI embeddings, can use hugging face or other embeddings too  https://github.com/langchain-ai/langchain/blob/master/templates/rag-redis/rag_redis/chain.py
         */
    }
}

export {
    addOpenAIEmbeddingsToRedis
}