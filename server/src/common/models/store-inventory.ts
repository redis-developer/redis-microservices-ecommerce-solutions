interface IStore {
  storeId?: string;
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

export type {
  IStore,
  IStoreInventory
}