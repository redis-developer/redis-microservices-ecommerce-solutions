'use client';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Alert from '@/components/Alert';
import { getProducts, triggerResetInventory } from '@/utils/services';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Home() {
  const [products, setProducts] = useState<models.Product[]>();
  const [alertNotification, setAlertNotification] = useState({ title: '', message: '' });

  async function refreshProducts(search: string) {
    setProducts(await getProducts(search.replace(/\?search=/g, '')));
  }

  async function resetStockQtyBtnClick() {
    setAlertNotification({ title: '', message: '' });

    await triggerResetInventory();
    await refreshProducts("");

    setAlertNotification({
      title: `RESET STOCK QTY`,
      message:
        'Stock Qty of all products are updated to default value!',
    });
  }

  useEffect(() => {
    (async () => {
      const search = window?.location?.search ?? '';
      await refreshProducts(search);
    })();
  }, []);

  return (
    <>
      <Navbar refreshProducts={refreshProducts} />
      <Cart refreshProducts={refreshProducts} setAlertNotification={setAlertNotification} />
      <main className="pt-12">
        <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
          <div className="mb-2 flex justify-between">
            <span>Showing {products?.length} products</span>
            <button
              type="button"
              onClick={resetStockQtyBtnClick}
              className="inline-block rounded bg-slate-300 hover:bg-slate-400 px-4 pt-2 pb-2 text-xs font-semibold uppercase leading-normal text-black">
              Reset Stock QTY
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products?.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </main>
      {!!alertNotification &&
        typeof window !== 'undefined' &&
        createPortal(<Alert {...alertNotification} />, document.body)}
    </>
  );
}
