import orders from '@/data/orders';
import OrderLineItem from '@/components/OrderLineItem';
import Navbar from '@/components/Navbar';

async function getData() {
  return Promise.resolve(orders);
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
                <div className="flex flex-col justify-start items-start my-4 w-full shadow-lg">
                    <div className="w-full flex flex-row justify-between items-start dark:text-white leading-6 xl:leading-5 text-gray-800 bg-gray-200 p-2">
                        <div>
                            <h5 className="text-md font-bold uppercase">Order</h5>
                            <p className="text-sm">#{order.orderId}</p>
                        </div>
                        <div className="self-end">
                            <h5 className="text-md font-bold uppercase">Placed</h5>
                            <p className="text-sm">{order.orderDate}</p>
                        </div>
                        <div className="self-end">
                            <h5 className="text-md font-bold uppercase">Total</h5>
                            <p className="text-sm">${Number(order.total).toLocaleString('en')}</p>
                        </div>
                    </div>
                  {order.items.map((item) => (
                    <OrderLineItem key={item.id} item={item} />
                  ))}
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}
