'use client';
import cartReducer, { CartAction, CartItem } from '@/state/cart';
import { createContext, Dispatch, useReducer } from 'react';

export const CartContext = createContext<CartItem[]>([]);
export const CartDispatchContext = createContext<Dispatch<CartAction>>(
  () => {},
);

export default function CartProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={cart}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}
