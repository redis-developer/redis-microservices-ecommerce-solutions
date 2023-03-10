# createOrder

## Request

```json
POST http://localhost:3000/orders/createOrder
{
    "products":[{
        "productId":11000,
        "qty":2,
        "productPrice":3995
    },
    {
        "productId":11001,
        "qty":1,
        "productPrice":5450
    }]
}
```

## Response

```json
{
  "data": "63f5f8dc3696d145a45775a6", //orderId
  "error": null,
  "auth": "SES_94ff24a8-65b5-4795-9227-99906a43884e"
}
```
