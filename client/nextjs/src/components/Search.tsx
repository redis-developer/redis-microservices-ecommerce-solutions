'use client';

import { useRouter } from 'next/navigation';

interface SearchProps {
  refreshProducts?: (search: string) => void;
}

export default function Search({ refreshProducts }: SearchProps) {
  const router = useRouter();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const data: { search: string } = Object.fromEntries(
          new FormData(ev.currentTarget),
        ) as { search: string };
        if (!data.search) {
          router.push(`/`);
        } else {
          router.push(`/?search=${data.search}`);
        }

        if (refreshProducts) {
          refreshProducts(data.search);
        }
      }}
      className="order-last mb-0 pr-8"
      action="">
      <input
        className="w-72 py-1 pl-3 pr-10 rounded-full focus:outline-0"
        type="text"
        placeholder="Search.."
        name="search"
      />
      <button className="-ml-8 border-6 bg-trasparent" type="submit">
        <i className="fa fa-search text-gray-400"></i>
      </button>
    </form>
  );
}
