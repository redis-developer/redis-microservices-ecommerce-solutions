# viewOrderHistory

## Request

```json
GET http://localhost:3000/orderHistory/viewOrderHistory
```

Note : Need Bearer token authentication for viewing order history.

Request Header -> Authorization (type) -> Bearer Token -> use "auth" Token received from [createOrder](./create-order.md) API response

## Response

```json
{
  "data": [
    {
      "orderId": "01GTH7JTQWP5QSEY32NNKT6B88",
      "userId": "ADMIN",
      "orderStatusCode": 1,
      "products": [
        {
          "productId": 11000,
          "qty": 10,
          "productPrice": 3995,
          "productData": {
            "id": 11000,
            "price": 3995,
            "productDisplayName": "Puma Men Slick 3HD Yellow Black Watches",
            "variantName": "Slick 3HD Yellow",
            "brandName": "Puma",
            "ageGroup": "Adults-Men",
            "gender": "Men",
            "displayCategories": "Accessories",
            "styleImages": {
              "default": {
                "imageURL": "http://host.docker.internal:8080/images/11000.jpg"
              }
            },
            "productDescriptors": {
              "description": {
                "value": "<p style=\"text-align: justify;\">Stylish and comfortable, this motorsport inspired wrist watch from puma is designed with a plastic case and a PU strap thereby&nbsp;    giving a sleek look. The perfect accessory for all urban trend setters, this watch is great for everyday casual wear.<br /><br /><strong>Case diameter</strong>: 40 mm<br /><strong>Case thickness</strong>: 12 mm<br /><strong>Dial shape</strong>: Round<br /><strong>Warranty</strong>: 2 Years<br /><br />Plastic case with a fixed bezel for added durability, style and comfort <br />PU straps with a tang clasp for comfort and style<br />Black dial with cat logo below 3 o&amp;  rsquo  clock marking<br />12, 6 and 9 o'clock written boldly<br />Smaller markings showing the hours, minutes, seconds and nano seconds<br />Quartz movement of time display <br />Screw to reset time <br />Solid case back made of stainless steel for enhanced durability<br />Water resistant up to 50 meters</p>"
              }
            }
          }
        },
        {
          "productId": 11001,
          "qty": 19,
          "productPrice": 5450,
          "productData": {
            "id": 11001,
            "price": 5450,
            "productDisplayName": "Puma Men Top Fluctuation Red Black Watches",
            "variantName": "Top Fluctuation Red",
            "brandName": "Puma",
            "ageGroup": "Adults-Men",
            "gender": "Men",
            "displayCategories": "Accessories",
            "styleImages": {
              "default": {
                "imageURL": "http://host.docker.internal:8080/images/11001.jpg"
              }
            },
            "productDescriptors": {
              "description": {
                "value": "<p style=\"text-align: justify;\">This watch from puma comes in a clean sleek design. This active watch is perfect for urban wear and can serve you well in the gym or a night of clubbing.<br /><strong><br />Case diamete</strong>r: 40 mm&lt;</p>"
              }
            }
          }
        }
      ],
      "createdOn": "2023-03-02T13:18:31.657Z",
      "createdBy": "ADMIN",
      "lastUpdatedOn": null,
      "lastUpdatedBy": null
    }
    //...
  ],
  "error": null
}
```
