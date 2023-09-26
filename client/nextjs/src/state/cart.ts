
const QTY_EXCEED_MSG = "The quantity you have selected for this product exceeds the available limit.";

export default function cartReducer(
  cart: models.CartItem[],
  action: actions.CartAction,
) {
  switch (action.type) {
    case 'add_to_cart': {
      let found = false;

      cart = cart.map((c) => {
        if (c.product.productId === action.item.product.productId) {
          found = true;
          c.quantity += 1;

          if (c.quantity > c.product.stockQty) {
            c.quantity = c.product.stockQty;
            alert(QTY_EXCEED_MSG)
          }

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
          if (c.product.productId === action.item.product.productId) {

            if (action.item.quantity > c.product.stockQty) {
              c.quantity = c.product.stockQty;
              //alert(QTY_EXCEED_MSG)
            }
            else {
              c.quantity = action.item.quantity;
            }

            return c;
          } else {
            return c;
          }
        })
        .filter((c) => c.quantity > 0);
    }
    case 'remove_from_cart': {
      return cart.filter((i) => i.product.productId !== action.item.product.productId);
    }
    case 'clear_cart': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + (action as any).type);
    }
  }
}
