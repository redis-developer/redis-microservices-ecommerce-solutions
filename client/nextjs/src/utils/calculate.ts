export function orderTotal(order: models.Order) {
  return order.products.reduce(
    (total, product) => total + product.qty * product.productPrice,
    0,
  );
}
