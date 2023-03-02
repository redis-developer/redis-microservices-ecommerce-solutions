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
            "value": "<p style=\"text-align: justify;\">Stylish and comfortable, this motorsport inspired wrist watch from puma is designed with a plastic case and a PU strap thereby&nbsp;    giving a sleek look. The perfect accessory for all urban trend setters, this watch is great for everyday casual wear.<br /><br /><strong>Case diameter</strong>: 40 mm<br /><strong>Case thickness</strong>: 12 mm<br /><strong>Dial shape</strong>: Round<br /><strong>Warranty</strong>: 2 Years<br /><br />Plastic case with a fixed bezel for added durability, style and comfort <br />PU straps with a tang clasp for comfort and style<br />Black dial with cat logo below 3 o&amp;  rsquo  clock marking<br />12, 6 and 9 o'clock written boldly<br />Smaller markings showing the hours, minutes, seconds and nano seconds<br />Quartz movement of time display <br />Screw to reset time <br />Solid case back made of stainless steel for enhanced durability<br />Water resistant up to 50 meters</p>"
          }
        }
      },
      "productId": 11000
    }
    //...
  ],
  "error": null
}
```
