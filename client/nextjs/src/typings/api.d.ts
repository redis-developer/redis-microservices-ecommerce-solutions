declare namespace api {
  type ProductResponse = Response<
    {
      _id: number;
      data: models.Product;
    }[]
  >;

  type OrderHistoryResponse = Response<models.Order[]>;
  type OrderResponse = Response<string>;

  interface OrderRequest {
    products: models.OrderItem[];
  }

  interface Response<T> {
    error: Error;
    data: T;
  }
}
