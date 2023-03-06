'use client';

import { CartContext, CartDispatchContext } from '@/components/CartProvider';
import Alert from '@/components/Alert';
import { createOrder } from '@/utils/services';
import { useContext, useRef, useState } from 'react';
import CartItem from './CartItem';
import { createPortal } from 'react-dom';

export default function Cart() {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ title: '', message: '' });
  const overlay = useRef<HTMLDivElement>(null);
  const cart = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);

  function toggleOpen() {
    if (open) {
      document.body.classList.remove('overflow-hidden');
    } else {
      document.body.classList.add('overflow-hidden');
    }
    setOpen(!open);
  }

  async function submitOrder() {
    const order = await createOrder(
      cart.map((item) => {
        return {
          productId: item.product.id,
          qty: item.quantity,
          productPrice: item.product.price,
        };
      }),
    );

    cartDispatch({
      type: 'clear_cart',
    });

    toggleOpen();

    setNotification({
      title: `Order #${order.data}`,
      message:
        'Order placed, click on the "Orders" tab to see your order status!',
    });
  }

  return (
    <>
      <div
        onClick={toggleOpen}
        className="fas fa-shopping-cart flex justify-center items-center w-12 h-12 rounded-full cursor-pointer fixed bottom-5 right-5 text-2xl bg-orange-300"
        style={{ display: 'flex' }}>
        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-white border-orange-300 border-2 text-xs absolute -top-2 -right-2">
          {cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </div>
      {open && (
        <div
          ref={overlay}
          onClick={(ev) => {
            if (ev.target === overlay.current) {
              toggleOpen();
            }
          }}
          className="flex flex-col fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-60">
          <div className="flex flex-col self-end flex-grow w-full md:w-1/3 bg-white">
            <div className="flex justify-between items-center p-2 bg-orange-300 text-md">
              <div>
                <i className="fas fa-shopping-cart mr-1" aria-hidden="true" />
                Cart
              </div>
              <div onClick={toggleOpen}>
                <i className="fas fa-times cursor-pointer" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-col flex-grow pt-4 px-4 overflow-y-auto h-px">
              {cart.map((item) => {
                return (
                  <CartItem
                    key={item.product.id}
                    {...item}
                    handleChange={(value) => {
                      cartDispatch({
                        type: 'update_quantity',
                        item: {
                          product: item.product,
                          quantity: value,
                        },
                      });
                    }}
                    handleDelete={() => {
                      cartDispatch({
                        type: 'remove_from_cart',
                        item,
                      });
                    }}
                  />
                );
              })}
            </div>
            <button
              onClick={() => {
                void submitOrder();
              }}
              className="flex justify-center items-center self-center m-3 p-2 bg-orange-300 rounded font-semibold uppercase text-sm">
              Buy Now
            </button>
          </div>
        </div>
      )}
      {!!notification &&
        typeof window !== 'undefined' &&
        createPortal(<Alert {...notification} />, document.body)}
    </>
  );
}
