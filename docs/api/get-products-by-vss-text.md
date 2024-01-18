# getProductsByVSSText

## Request

```json
POST http://localhost:3000/products/getProductsByVSSText
{
   "searchText":"pure cotton blue shirts",

   //optional
   "maxProductCount": 4, // 2 (default)
   "similarityScoreLimit":0.2, // 0.2 (default)
   "embeddingsType":"OpenAI" // OpenAI (default), HuggingFace
}
```

## Response

```json
{
  "data": [
    {
      "productId": "11031",
      "price": 1099,
      "productDisplayName": "Jealous 21 Women Check Blue Tops",
      "productDescriptors_description_value": "<p><strong>Composition</strong><br />Green and navy blue checked round neck blouson tunic top made of 100% cotton, has a full buttoned placket, three fourth sleeves with buttoned cuffs and a belt below the waist<br /><br /><strong>Fitting</strong><br />Regular<br /><br /><strong>Wash care</strong><br />Machine/hand wash separately in mild detergent<br />Do not bleach or wring<br />Dry in shade<br />Medium iron<br /><br />If you're in the mood to have some checked fun, this blouson tunic top from jealous 21 will fulfil your heart's desire with &eacute;lan. The cotton fabric promises comfort, while the smart checks guarantee unparalleled attention. Pair this top with leggings and ballerinas for a cute, neat look.<br /><br /><em>Model statistics</em><br />The model wears size M in tops<br />Height: 5'7\"; Chest: 33\"; Waist: 25\"</p>",
      "stockQty": 25,
      "productColors": "Blue,Green",
      "similarityScore": 0.168704152107
      //...
    }
  ],
  "error": null,
  "auth": "SES_fd57d7f4-3deb-418f-9a95-6749cd06e348"
}
```
