import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';

async function getData() {
  const response = await fetch(
    `${process.env.API_GATEWAY_URI}/products/getProductsByFilter`,
    {
      method: 'POST',
      next: {
        revalidate: 15,
      },
    },
  );
  const result: api.ProductResponse = await response.json();
  return result.data.map((product) => product.data);
}

export default async function Home() {
  const products = await getData();

  return (
    <>
      <Navbar />
      <Cart />
      <main className="pt-12">
        <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
