import Image from 'next/image';
import orders from '@/data/orders';

interface Props {
  item: (typeof orders)[0]['items'][0];
}

export default function OrderLineItem({ item }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-start items-start md:items-center w-full border-b px-2 border-gray-200">
      <div className="w-40">
        <Image
          className="rounded-t-lg"
          src={item.styleImages.default.imageURL}
          alt={item.productDisplayName}
          width={480}
          height={640}
        />
      </div>
      <div className="flex flex-col md:flex-row items-start w-full pb-8 space-y-4 md:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-8">
          <h5 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
            {item.productDisplayName}
          </h5>
        </div>
        <div className="flex space-x-8 justify-end items-start w-full">
          <p className="text-base dark:text-white xl:text-lg leading-6">
            ${Number(item.price).toLocaleString('en')} x 1
          </p>
          <p className="text-base dark:text-white xl:text-lg leading-6 font-semibold">
            ${Number(item.price).toLocaleString('en')}
          </p>
        </div>
      </div>
    </div>
  );
}
