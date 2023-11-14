import type { IProduct } from "./product";

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

interface IStoreProduct extends IProduct, IStore {

}

export type {
  IStore,
  IStoreInventory,
  IStoreProduct
}