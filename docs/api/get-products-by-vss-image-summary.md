# getProductsByVSSImageSummary

## Request

```json
POST http://localhost:3000/products/getProductsByVSSImageSummary
{
   "searchText":"girl with blue t shirt",

   //optional
   "maxProductCount": 4, // 2 (default)
   "similarityScoreLimit":0.2, // 0.2 (default)
}
```

## Response

```json
{
  "data": [
    {
      "productId": "11028",
      "price": 1295,
      "productDisplayName": "Wrangler Women Blue Kangroo Pocket Tunic",
      "gender": "Women",
      "similarityScore": 0.116240024567,
      "imageSummary": "...."
      //...
    }
  ],
  "error": null,
  "auth": "SES_fd57d7f4-3deb-418f-9a95-6749cd06e348"
}
```
