# getZipCodes

## Request

```json
POST http://localhost:3000/products/getZipCodes
```

## Response

```json
{
  "data": [
    {
      "zipLocation": {
        "longitude": -74.010418,
        "latitude": 41.503427
      },
      "zipCode": 12550,
      "statusCode": 1
    },
    {
      "zipLocation": {
        "longitude": -73.756233,
        "latitude": 42.65258
      },
      "zipCode": 12207,
      "statusCode": 1
    }
    //...
  ],
  "error": null
}
```
