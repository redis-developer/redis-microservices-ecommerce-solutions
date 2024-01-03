import { createClient } from 'redis';

//#region  types
type NodeRedisClientType = ReturnType<typeof createClient>;
interface IStore {
    storeId?: string;
    storeName?: string;
    storeLocation?: {
        latitude?: number;
        longitude?: number;
    } | string,
}
interface IStoreInventory extends IStore {
    productId?: string;
    productDisplayName?: string;
    stockQty?: number;
    statusCode?: number
}

interface IZipCode {
    zipCode?: number;
    zipLocation?: {
        latitude?: number;
        longitude?: number;
    } | string,
    statusCode?: number
}

//#endregion

//#region config
const DEFAULT_PRODUCT_QTY = 25; //also in triggers/manual-trigger.js
const PRODUCT_IN_MAX_STORES = 5; //also in triggers/manual-trigger.js
const MAX_PRODUCT_QTY_IN_STORE = Math.floor(DEFAULT_PRODUCT_QTY / PRODUCT_IN_MAX_STORES);

const STORE_INVENTORY_KEY_PREFIX = 'storeInventory:storeInventoryId';
const PRODUCT_KEY_PREFIX = 'products:productId';
const ZIP_CODE_KEY_PREFIX = 'zipCodes:zipCode';

const OPEN_AI_PRODUCT_KEY_PREFIX = 'openAIProducts:'; //also in common ->server-config.ts -> REDIS_KEYS
const OPEN_AI_PRODUCT_INDEX_NAME = 'openAIProductsIdx';
const HUGGING_FACE_PRODUCT_KEY_PREFIX = 'huggingFaceProducts:';
const HUGGING_FACE_PRODUCT_INDEX_NAME = 'huggingFaceProductsIdx';
const OPEN_AI_PRODUCT_IMG_TEXT_KEY_PREFIX = 'openAIProductImgText:';
const OPEN_AI_PRODUCT_IMG_TEXT_INDEX_NAME = 'openAIProductImgIdx';

//#endregion


export {
    DEFAULT_PRODUCT_QTY,
    PRODUCT_IN_MAX_STORES,
    MAX_PRODUCT_QTY_IN_STORE,
    STORE_INVENTORY_KEY_PREFIX,
    PRODUCT_KEY_PREFIX,
    ZIP_CODE_KEY_PREFIX,
    OPEN_AI_PRODUCT_KEY_PREFIX,
    OPEN_AI_PRODUCT_INDEX_NAME,
    HUGGING_FACE_PRODUCT_KEY_PREFIX,
    HUGGING_FACE_PRODUCT_INDEX_NAME,
    OPEN_AI_PRODUCT_IMG_TEXT_KEY_PREFIX,
    OPEN_AI_PRODUCT_IMG_TEXT_INDEX_NAME
}

export type {
    NodeRedisClientType,
    IStore,
    IStoreInventory,
    IZipCode
}