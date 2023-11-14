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

//#endregion


export {
    DEFAULT_PRODUCT_QTY,
    PRODUCT_IN_MAX_STORES,
    MAX_PRODUCT_QTY_IN_STORE,
    STORE_INVENTORY_KEY_PREFIX,
    PRODUCT_KEY_PREFIX,
    ZIP_CODE_KEY_PREFIX,
}

export type {
    NodeRedisClientType,
    IStore,
    IStoreInventory,
    IZipCode
}