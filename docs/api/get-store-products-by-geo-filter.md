# getStoreProductsByGeoFilter

## Request

```json
POST http://localhost:3000/products/getStoreProductsByGeoFilter
{
    "productDisplayName":"", // "puma"
    "searchRadiusInKm":1000, //optional (default 1000 km)
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
      "storeId": "09_NY_NEW_YORK_CITY",
      "storeLocation": {
        "longitude": -73.935242,
        "latitude": 40.73061
      },
      "productId": "11007",
      "productDisplayName": "Puma Men Turbo Black Chronograph Watch",
      "quantity": "5",
      "distInKm": "6.66861"
    }
    //...
  ],
  "error": null
}
```
