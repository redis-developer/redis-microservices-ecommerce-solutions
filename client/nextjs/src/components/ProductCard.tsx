'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { CartDispatchContext } from '@/components/CartProvider';
import { getShortName } from '@/utils/convert';

interface Props {
  product: models.Product;
}

export default function ProductCard({ product }: Props) {
  const cartDispatch = useContext(CartDispatchContext);

  return (
    <div className="flex justify-center">
      <div className="block max-w-sm rounded bg-white shadow-lg border border-neutral-200">
        <Image
          className="rounded-t-lg w-auto mx-auto"
          style={{ height: '160px' }}
          src={product.styleImages.default.imageURL}
          alt={product.productDisplayName}
          width={480}
          height={640}
        />
        <hr />
        <div className="p-6 bg-slate-100">
          <h5 className="mb-2 h-20 text-xl font-medium leading-tight text-neutral-800">
            {product.productDisplayName}
          </h5>
          <p className="mb-4 text-base text-neutral-600">
            {getShortName(product.productDescriptors.description.value)}
          </p>
          <p className="mb-4 text-base font-bold text-neutral-600">
            ${Number(product.price).toLocaleString('en')}
          </p>
          <button
            type="button"
            onClick={() => {
              cartDispatch({
                item: { product: product, quantity: 1 },
                type: 'add_to_cart',
              });
            }}
            className="inline-block rounded bg-orange-300 hover:bg-orange-400 px-6 pt-2.5 pb-2 text-xs font-semibold uppercase leading-normal text-black">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
