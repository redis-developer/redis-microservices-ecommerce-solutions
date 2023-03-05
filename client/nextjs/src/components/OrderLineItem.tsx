import Image from 'next/image';

interface Props {
  item: models.OrderItem;
}

export default function OrderLineItem({ item }: Props) {
  const product = item.productData;

  return (
    <div className="flex flex-col md:flex-row justify-start items-start md:items-center w-full border-b px-2 border-gray-200">
      <div className="w-32">
        <Image
          className="rounded-t-lg"
          src={product.styleImages.default.imageURL}
          alt={product.productDisplayName}
          width={480}
          height={640}
        />
      </div>
      <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-8">
          <h5 className="text-lg font-semibold leading-6 text-gray-800">
            {product.productDisplayName}
          </h5>
        </div>
        <div className="flex space-x-8 justify-end items-start w-full">
          <p className="text-base xl:text-lg leading-6">
            ${Number(product.price).toLocaleString('en')} x {item.qty}
          </p>
          <p className="text-base xl:text-lg leading-6 font-semibold">
            ${Number(product.price * item.qty).toLocaleString('en')}
          </p>
        </div>
      </div>
    </div>
  );
}
