# getStoreProductsByGeoFilter

## Request

```json
POST http://localhost:3000/products/getStoreProductsByGeoFilter
{
    "productDisplayName":"", // "puma"
    "searchRadiusInMiles":50, //optional (default 50mi)
    "userLocation": {
        "latitude": 40.785091,
        "longitude": -73.968285
    }
}
```

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
      "productDescriptors_description_value": "...",

      "stockQty": "5",
      "storeId": "11_NY_MELVILLE",
      "storeLocation": {
        "longitude": -73.41512,
        "latitude": 40.79343
      },
      "distInMiles": "46.59194"
    }
    //...
  ],
  "error": null
}
```
