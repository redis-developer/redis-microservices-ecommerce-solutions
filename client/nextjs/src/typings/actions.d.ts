declare namespace actions {
  interface AddToCart {
    type: 'add_to_cart';
    item: models.CartItem;
  }

  interface UpdateQuantity {
    type: 'update_quantity';
    item: models.CartItem;
  }

  interface RemoveFromCart {
    type: 'remove_from_cart';
    item: models.CartItem;
  }

  interface ClearCart {
    type: 'clear_cart';
  }

  type CartAction = AddToCart | UpdateQuantity | RemoveFromCart | ClearCart;
}
