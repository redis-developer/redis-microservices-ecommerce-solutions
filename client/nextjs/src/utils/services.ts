let authorization: string;

async function request(input: RequestInfo | URL, init: RequestInit = {}) {
  if (!authorization) {
    if (
      typeof process.env.NEXT_PUBLIC_USER === 'string' &&
      process.env.NEXT_PUBLIC_USER.length > 0
    ) {
      authorization = process.env.NEXT_PUBLIC_USER;
    } else if (!!process.env.USER) {
      authorization = process.env.USER;
    }
  }

  init.headers = {
    ...init.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (!!authorization) {
    (init.headers as any).Authorization = `Bearer ${authorization}`;
  }

  init.cache = 'no-store';

  const response = await fetch(input, init);
  const auth = response.headers.get('set-authorization');

  if (!!auth) {
    authorization = auth;
  }

  return response;
}

export async function getOrderHistory(): Promise<models.Order[]> {
  const response = await request(
    `${process.env.API_GATEWAY_URI}/orderHistory/viewOrderHistory`,
  );

  const results: api.OrderHistoryResponse = await response.json();

  return results.data;
}

export async function createOrder(
  order: Omit<models.OrderItem, 'productData'>[],
): Promise<void> {
  await request(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URI}/orders/createOrder`,
    {
      method: 'POST',
      body: JSON.stringify({
        products: order,
      }),
    },
  );
}

export async function getProducts(): Promise<models.Product[]> {
  const response = await request(
    `${process.env.API_GATEWAY_URI}/products/getProductsByFilter`,
    {
      method: 'POST',
    },
  );
  const result: api.ProductResponse = await response.json();
  return result.data?.map((product) => product.data) ?? [];
}
