import type { AutoCompleteTextProps } from '@/components/AutoCompleteText';

import Link from 'next/link';
import clsx from 'clsx';
import Search from './Search';
import AutoCompleteText from '@/components/AutoCompleteText';

export interface NavbarProps {
  path?: string;
  refreshProducts?: (search: string) => void;
  autoCompleteText?: AutoCompleteTextProps;
}

export default function Navbar({ path = '', refreshProducts, autoCompleteText }: NavbarProps) {
  const isOrders = /orders/.test(path);
  const isAdmin = /admin/.test(path);
  const linkClass =
    'flex flex-initial items-center h-full pt-1 px-4 border-b-4 hover:text-neutral-200 font-bold';
  const ordersClass = clsx(linkClass, {
    'border-transparent': !isOrders,
    'border-orange-300': isOrders,
  });
  const adminClass = clsx(linkClass, {
    'border-transparent': !isAdmin,
    'border-orange-300': isAdmin,
  });

  return (
    <nav className="fixed w-full px-5 flex justify-between items-center h-14 bg-slate-600 drop-shadow-md">
      <div>
        <Link
          prefetch={false}
          href="/"
          className="text-white text-2xl font-semibold italic">
          Redis Shopping
        </Link>
      </div>

      <div
        id="main-nav"
        className="bg-gray-700 flex space-y-0 relative top-0 right-0 p-0 flex-row h-full flex-grow justify-between items-center ml-10 bg-inherit">
        <div className="order-first flex flex-row items-center h-full text-white space-y-0 space-x-3">
          <Link prefetch={false} className={ordersClass} href="/orders">
            Orders
          </Link>

          <Link prefetch={false} className={adminClass} href="/admin">
            Admin
          </Link>
        </div>
        <div className='flex'>
          {autoCompleteText?.listItems && Number(autoCompleteText.listItems.length) > 0 &&
            <div className='mr-2'>
              <AutoCompleteText listItems={autoCompleteText.listItems}
                placeHolder={autoCompleteText.placeHolder}
                suggestionSelectedCallback={autoCompleteText.suggestionSelectedCallback}>
              </AutoCompleteText>
            </div>
          }
          <Search refreshProducts={refreshProducts} />
        </div>

      </div>
    </nav>
  );
}
