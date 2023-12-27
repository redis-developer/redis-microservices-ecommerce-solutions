'use client';

import { useRouter } from 'next/navigation';

interface SearchProps {
  refreshProducts?: (searchData?: models.Product) => void;
  searchPlaceHolder?: string;
}

export default function Search({ refreshProducts, searchPlaceHolder }: SearchProps) {
  const router = useRouter();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        const searchData: models.Product = Object.fromEntries(
          new FormData(ev.currentTarget)
        ) as any;

        // if (!searchData.productDisplayName) {
        //   router.push(`/`);
        // } else {
        //   router.push(`/?productDisplayName=${searchData.productDisplayName}`);
        // }

        if (refreshProducts) {
          refreshProducts(searchData);
        }
      }}
      className="order-last mb-0 pr-8"
      action="">
      <input
        className="w-72 py-1 pl-3 pr-10 rounded-full focus:outline-0"
        type="text"
        placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search..'}
        name="productDisplayName"
      />
      <button className="-ml-8 border-6 bg-trasparent" type="submit">
        <i className="fa fa-search text-gray-400"></i>
      </button>
    </form>
  );
}
