'use client';

import { useRouter } from 'next/navigation';

export default function Search() {
  const router = useRouter();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const data: { search: string } = Object.fromEntries(
          new FormData(ev.currentTarget),
        ) as { search: string };
        router.push(`/?search=${data.search}`);
        router.replace(`/?search=${data.search}`);
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
