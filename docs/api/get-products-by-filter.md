# getProductsByFilter

## Request

```json
POST http://localhost:3000/products/getProductsByFilter
{
   "productDisplayName":"" // "puma"
}
```

- productDisplayName:"" -> get all products (where max records count is MAX_DOCUMENTS_FETCH_LIMIT as defined in server/src/common/config/constants.ts)

## Response

```json
{
  "data": [
    {
      "productId": "11000",
      "price": 3995,
      "productDisplayName": "Puma Men Slick 3HD Yellow Black Watches",
      "variantName": "Slick 3HD Yellow",
      "brandName": "Puma",
      "ageGroup": "Adults-Men",
      "gender": "Men",
      "displayCategories": "Accessories",
      "masterCategory_typeName": "Accessories",
      "subCategory_typeName": "Watches",
      "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11000.jpg",
      "productDescriptors_description_value": "<p style=\"text-align: justify;\">Stylish and comfortable, ...",
      "createdOn": "2023-07-13T14:07:38.020Z",
      "createdBy": "ADMIN",
      "lastUpdatedOn": "2023-07-13T14:07:38.020Z",
      "lastUpdatedBy": null,
      "statusCode": 1
    }
    //...
  ],
  "error": null,
  "isFromCache": false
}
```
