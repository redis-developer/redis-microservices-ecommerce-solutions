export default function cartReducer(
  cart: models.CartItem[],
  action: actions.CartAction,
) {
  switch (action.type) {
    case 'add_to_cart': {
      let found = false;

      cart = cart.map((c) => {
        if (c.product.id === action.item.product.id) {
          found = true;
          c.quantity += 1;
          return c;
        } else {
          return c;
        }
      });

      if (!found) {
        cart.push(action.item);
      }

      return cart;
    }
    case 'update_quantity': {
      return cart
        .map((c) => {
          if (c.product.id === action.item.product.id) {
            c.quantity = action.item.quantity;
            return c;
          } else {
            return c;
          }
        })
        .filter((c) => c.quantity > 0);
    }
    case 'remove_from_cart': {
      return cart.filter((i) => i.product.id !== action.item.product.id);
    }
    case 'clear_cart': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + (action as any).type);
    }
  }
}
