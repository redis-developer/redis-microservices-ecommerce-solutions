import Image from 'next/image';
import products from '@/data/products';

interface Props {
  product: (typeof products)[0];
}

function getShortName(str: string, len = 80) {
  const regex = new RegExp('^(.{' + len + '}[^\\s]*).*', 'mi');
  const noHtml = str.replace(/(<([^>]+)>)/gi, ' ').trim();

  return noHtml.replace(regex, '$1').trim() + ' ...';
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex justify-center">
      <div className="block max-w-sm rounded-lg bg-white shadow-lg dark:bg-neutral-700">
        <Image
          className="rounded-t-lg"
          src={product.styleImages.default.imageURL}
          alt={product.productDisplayName}
          width={480}
          height={640}
        />
        <hr />
        <div className="p-6 bg-slate-100">
          <h5 className="mb-2 h-20 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {product.productDisplayName}
          </h5>
          <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {getShortName(product.productDescriptors.description.value)}
          </p>
          <p className="mb-4 text-base font-bold text-neutral-600 dark:text-neutral-200">
            ${Number(product.price).toLocaleString('en')}
          </p>
          <button
            type="button"
            className="inline-block rounded bg-yellow-300 hover:bg-yellow-400 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-black">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
