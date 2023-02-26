# viewOrderHistory

## Request

```json
GET http://localhost:3000/orderHistory/viewOrderHistory?userId=ADMIN
```

## Response

```json
{
  "data": [
    {
      "orderId": "01GT6S1ASB494HD983DGWE9AQS",
      "userId": "ADMIN",
      "orderStatusCode": 1,
      "products": [
        {
          "productId": 11000,
          "qty": 1,
          "productPrice": 3995
        },
        {
          "productId": 11001,
          "qty": 1,
          "productPrice": 5450
        }
      ],
      "createdOn": "2023-02-26T11:51:53.896Z",
      "createdBy": "ADMIN",
      "lastUpdatedOn": null,
      "lastUpdatedBy": null
    }
  ],
  "error": null
}
```
