'use client';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import { getProducts } from '@/utils/services';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProduct] = useState<models.Product[]>();

  useEffect(() => {
    (async () => {
      setProduct(await getProducts(window?.location?.search));
    })();
  }, []);

  return (
    <>
      <Navbar />
      <Cart />
      <main className="pt-12">
        <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
          <div className="mb-2">Showing {products?.length} products</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
