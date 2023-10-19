import type { NodeRedisClientType, IStore, IStoreInventory } from './config.js';

import { Prisma } from '@prisma/client';
import * as CONFIG from './config.js';


const deleteExistingKeysInRedis = async (_keyPrefix: string, redisClient: NodeRedisClientType) => {

    if (_keyPrefix) {
        const existingKeys = await redisClient?.keys(`${_keyPrefix}:*`);
        if (existingKeys?.length) {
            console.log(`deleting existing keys/ index starting with ${_keyPrefix}`);
            await redisClient?.del(existingKeys);
        }
    }
}

const getStoreDetails = (): IStore[] => {
    //consider following sample stores in NewYork state (USA)

    const stores: IStore[] = [{
        storeId: '01_NY_BUFFALO',
        storeLocation: {
            latitude: 42.880230,
            longitude: -78.878738,
        }
    },
    {
        storeId: '02_NY_ROCHESTER',
        storeLocation: {
            latitude: 43.156578,
            longitude: -77.608849,
        }
    },
    {
        storeId: '03_NY_BINGHAMTON',
        storeLocation: {
            latitude: 42.098701,
            longitude: -75.912537,
        }
    },
    {
        storeId: '04_NY_SYRACUSE',
        storeLocation: {
            latitude: 43.088947,
            longitude: -76.154480,
        }
    },
    {
        storeId: '05_NY_WATERTOWN',
        storeLocation: {
            latitude: 43.974785,
            longitude: -75.910759,
        }
    },
    {
        storeId: '06_NY_UTICA',
        storeLocation: {
            latitude: 43.107204,
            longitude: -75.252312,
        }
    },
    {
        storeId: '07_NY_ALBANY',
        storeLocation: {
            latitude: 42.652580,
            longitude: -73.756233,
        }
    },
    {
        storeId: '08_NY_PLATTSBURGH',
        storeLocation: {
            latitude: 44.699764,
            longitude: -73.471428,
        }
    },
    {
        storeId: '09_NY_NEW_YORK_CITY',
        storeLocation: {
            latitude: 40.730610,
            longitude: -73.935242,
        }
    },
    {
        storeId: '10_NY_POUGHKEEPSIE',
        storeLocation: {
            latitude: 41.708290,
            longitude: -73.923912,
        }
    },
    {
        storeId: '11_NY_MELVILLE',
        storeLocation: {
            latitude: 40.79343,
            longitude: -73.41512,
        }
    }];

    return stores;
}

const getRandomStores = (_count: number): IStore[] => {
    const stores = getStoreDetails();

    const shuffleArray = stores;
    for (let i = shuffleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
    }

    return stores.slice(0, _count);
}

const addProductsToRandomStoresInRedis = async (_products: Prisma.ProductCreateInput[], _storeCount: number, redisClient: NodeRedisClientType) => {
    try {
        if (_products?.length && redisClient) {
            await deleteExistingKeysInRedis(CONFIG.STORE_INVENTORY_KEY_PREFIX, redisClient);

            for (let product of _products) {
                const randomStores = getRandomStores(_storeCount);
                for (let store of randomStores) {
                    const storesInventory: IStoreInventory = {
                        storeId: store.storeId,
                        storeLocation: store.storeLocation,
                        productId: product.productId,
                        quantity: CONFIG.MAX_PRODUCT_QTY_IN_STORE
                    }
                    const id = CONFIG.STORE_INVENTORY_KEY_PREFIX + ':' + store.storeId + "_" + product.productId;
                    //@ts-ignore
                    await redisClient.json.set(id, '.', storesInventory);
                    // console.log(id);
                }
            }
        }
    }
    catch (err) {
        console.log(`addProductToRandomStoresInRedis failed `, err);
    }
}



export {
    deleteExistingKeysInRedis,
    addProductsToRandomStoresInRedis,
}