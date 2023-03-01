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
      "_id": 11000,
      "data": {
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
        }
      }
    }
    //...
  ],
  "error": null
}
```
