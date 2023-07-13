# createOrder

## Request

```json
POST http://localhost:3000/orders/createOrder
{
  "products": [
    {
      "productId": "11002",
      "qty": 1,
      "productPrice": 4950
    },
    {
      "productId": "11012",
      "qty": 2,
      "productPrice": 1195
    }
  ]
}
```

## Response

```json
{
  "data": "d4075f43-c262-4027-ad25-7b1bc8c490b6", //orderId
  "error": null,
  "auth": "SES_37ef6fb0-cdda-4d91-952a-4042adca5cae"
}
```
