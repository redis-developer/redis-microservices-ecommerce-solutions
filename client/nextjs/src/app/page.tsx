import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import { getProducts } from '@/utils/services';

export default async function Home({ params }: { params: { search: string } }) {
  const products = await getProducts(params?.search);

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
