import products from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

async function getData() {
  return Promise.resolve(products);
}

export default async function Home() {
  const products = await getData();

  return (
    <main>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
