import Image from 'next/image';
import { getShortName } from '@/utils/convert';

interface CartItemProps extends models.CartItem {
  handleChange: (value: number) => unknown;
  handleDelete: () => unknown;
}

export default function CartItem({
  product,
  quantity,
  handleChange,
  handleDelete,
}: CartItemProps) {
  return (
    <div className="mb-3 rounded shadow-md">
      <div className="flex">
        <Image
          className="rounded-t-lg"
          style={{ height: '80px', width: 'auto' }}
          src={product.styleImages.default.imageURL}
          alt={product.productDisplayName}
          width={480}
          height={640}
        />
        <div className="flex-grow p-2">
          <h5 className="mb-1 font-semibold">{product.productDisplayName}</h5>
          <p className="text-neutral-500 text-sm">
            {getShortName(product.productDescriptors.description.value)}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center px-2 py-1 text-sm bg-orange-300">
        <div className="font-bold">
          ${Number(product.price).toLocaleString('en')}
        </div>
        <div>
          <input
            className="text-center w-12"
            type="number"
            defaultValue={quantity}
            onChange={(ev) => {
              handleChange(Number(ev.currentTarget.value));
            }}
          />
        </div>
        <div
          onClick={() => {
            handleDelete();
          }}
          className="fas fa-trash cursor-pointer"></div>
      </div>
    </div>
  );
}
