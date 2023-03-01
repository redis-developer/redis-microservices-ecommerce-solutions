'use client';
import cartReducer from '@/state/cart';
import { createContext, Dispatch, useReducer } from 'react';

export const CartContext = createContext<models.CartItem[]>([]);
export const CartDispatchContext = createContext<Dispatch<actions.CartAction>>(
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
