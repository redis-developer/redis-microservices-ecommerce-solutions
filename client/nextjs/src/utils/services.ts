let authorization: string;

async function request(input: RequestInfo | URL, init: RequestInit = {}) {
  const clientSide = typeof window !== 'undefined';

  init.headers = {
    ...init.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (!!authorization) {
    (init.headers as any).Authorization = `Bearer ${authorization}`;
  }

  init.cache = 'no-store';
  init.next = { revalidate: 0 };

  const response = await fetch(input, init);
  const result = await response.json();

  if (!!result.auth && clientSide) {
    authorization = result.auth;
  }

  return result;
}

export async function getOrderHistory(): Promise<models.Order[]> {
  const results: api.OrderHistoryResponse = await request(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URI}/orderHistory/viewOrderHistory`,
  );

  return results.data;
}

export async function createOrder(
  order: Omit<models.OrderItem, 'productData'>[],
): Promise<{ data: string }> {
  return await request(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URI}/orders/createOrder`,
    {
      method: 'POST',
      body: JSON.stringify({
        products: order,
      }),
    },
  );
}

export async function getProducts(search?: string): Promise<models.Product[]> {
  const result: api.ProductResponse = await request(
    `${process.env.API_GATEWAY_URI}/products/getProductsByFilter`,
    {
      method: 'POST',
      body: !search
        ? undefined
        : JSON.stringify({
            productDisplayName: search,
          }),
    },
  );

  return result.data?.map((product) => product.data) ?? [];
}
