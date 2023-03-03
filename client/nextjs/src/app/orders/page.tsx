import OrderLineItem from '@/components/OrderLineItem';
import Navbar from '@/components/Navbar';
import { orderTotal } from '@/utils/calculate';
import { stringDateToFormattedDate } from '@/utils/convert';

async function getData() {
  const response = await fetch(
    `${process.env.API_GATEWAY_URI}/orderHistory/viewOrderHistory?userId=ADMIN`,
    { cache: 'no-store' },
  );
  const productResponse = await fetch(
    `${process.env.API_GATEWAY_URI}/products/getProductsByFilter`,
    {
      method: 'POST',
      next: {
        revalidate: 300,
      },
    },
  );
  const productResults: api.ProductResponse = await productResponse.json();
  const products = productResults.data.map((product) => product.data);
  const result: api.OrderHistoryResponse = await response.json();

  return result.data?.map((order) => {
    order.products =
      order.products.map((item) => {
        item.product = products.find((product) => {
          return product.id === item.productId;
        }) as models.Product;

        return item;
      }) ?? [];

    return order;
  });
}

export default async function Home() {
  const orders = await getData();

  return (
    <>
      <Navbar path="orders" />
      <main>
        <div className="max-w-screen-xl mx-auto p-6">
          <h1 className="text-3xl">Your Orders</h1>
          {orders.map((order) => {
            return (
              <div
                key={order.orderId}
                className="flex flex-col justify-start items-start my-4 w-full shadow-lg">
                <div className="w-full flex flex-row justify-between items-start dark:text-white leading-6 xl:leading-5 text-gray-800 bg-gray-200 p-2">
                  <div>
                    <h5 className="text-md font-bold uppercase">Order</h5>
                    <p className="text-sm">#{order.orderId}</p>
                  </div>
                  <div className="self-end">
                    <h5 className="text-md font-bold uppercase">Placed</h5>
                    <p className="text-sm">
                      {stringDateToFormattedDate(order.createdOn)}
                    </p>
                  </div>
                  <div className="self-end">
                    <h5 className="text-md font-bold uppercase">Total</h5>
                    <p className="text-sm">
                      ${Number(orderTotal(order)).toLocaleString('en')}
                    </p>
                  </div>
                </div>
                {order.products.map((item) => (
                  <OrderLineItem key={item.productId} item={item} />
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
