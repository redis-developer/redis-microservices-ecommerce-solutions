import orders from '@/data/orders';
import OrderLineItem from '@/components/OrderLineItem';
import Navbar from '@/components/Navbar';

async function getData() {
  return Promise.resolve(orders);
}

export default async function Home() {
  const orders = await getData();

  return (
    <main>
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-6">
        <h1 className="text-3xl">Your Orders</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {orders.map((order) => {
            return order.items.map((item) => (
              <OrderLineItem key={item.id} item={item} />
            ));
          })}
        </div>
      </div>
    </main>
  );
}
