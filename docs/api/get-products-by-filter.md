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
        },
        "productDescriptors": {
          "description": {
            "value":
              "<p style=\"text-align: justify;\">This watch from puma comes in a clean sleek design. This active watch is perfect for urban wear and can serve you well in the gym or a night of clubbing.<br /><strong><br />Case diamete</strong>r: 40 mm&lt;</p>"
          }
        }
      }
    }
    //...
  ],
  "error": null
}
```
