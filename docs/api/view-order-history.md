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
      "orderId": "d4075f43-c262-4027-ad25-7b1bc8c490b6",
      "userId": "USR_22fcf2ee-465f-4341-89c2-c9d16b1f711b",
      "orderStatusCode": 4,
      "products": [
        {
          "productId": "11002",
          "qty": 1,
          "productPrice": 4950,
          "productData": {
            "productId": "11002",
            "price": 4950,
            "productDisplayName": "Puma Men Race Black Watch",
            "variantName": "Race 85",
            "brandName": "Puma",
            "ageGroup": "Adults-Men",
            "gender": "Men",
            "displayCategories": "Accessories",
            "masterCategory_typeName": "Accessories",
            "subCategory_typeName": "Watches",
            "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11002.jpg",
            "productDescriptors_description_value": "<p>This watch from puma comes in a heavy duty design. The assymentric dial and chunky...",
            "createdOn": "2023-07-13T14:07:38.024Z",
            "createdBy": "ADMIN",
            "lastUpdatedOn": "2023-07-13T14:07:38.024Z",
            "lastUpdatedBy": null,
            "statusCode": 1
          },
          "createdBy": "USR_22fcf2ee-465f-4341-89c2-c9d16b1f711b"
        },
        {
          "productId": "11012",
          "qty": 2,
          "productPrice": 1195,
          "productData": {
            "productId": "11012",
            "price": 1195,
            "productDisplayName": "Wrangler Women Frill Check Multi Tops",
            "variantName": "FRILL CHECK",
            "brandName": "Wrangler",
            "ageGroup": "Adults-Women",
            "gender": "Women",
            "displayCategories": "Sale and Clearance,Casual Wear",
            "masterCategory_typeName": "Apparel",
            "subCategory_typeName": "Topwear",
            "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11012.jpg",
            "productDescriptors_description_value": "<p><strong>Composition</strong><br /> Navy blue, red, yellow and white checked top made of 100% cotton, with a jabot collar, buttoned ...",
            "createdOn": "2023-07-13T14:07:38.048Z",
            "createdBy": "ADMIN",
            "lastUpdatedOn": "2023-07-13T14:07:38.048Z",
            "lastUpdatedBy": null,
            "statusCode": 1
          },
          "createdBy": "USR_22fcf2ee-465f-4341-89c2-c9d16b1f711b"
        }
      ],
      "createdBy": "USR_22fcf2ee-465f-4341-89c2-c9d16b1f711b",
      "lastUpdatedOn": "2023-07-13T14:11:49.997Z",
      "lastUpdatedBy": "USR_22fcf2ee-465f-4341-89c2-c9d16b1f711b"
    }
  ],
  "error": null,
  "auth": "SES_37ef6fb0-cdda-4d91-952a-4042adca5cae"
}
```
