# chatBot

## Request

```json
POST http://localhost:3000/products/chatBot
{
    "userMessage":"I am looking for a watch, Can you recommend anything for formal occasions with price under 50 dollars?"
}
```

## Response

```json
{
  "data": "Yes, I can recommend a watch for formal occasions with a price under $50. We have two options available from Puma that might interest you.\n\nThe first option is the <a href=\"/11006\">Puma Men Race Luminous Black Chronograph Watch</a> priced at $77.95. It features a stylish black dial with branding at the 12-hour mark, three time displays, and a date aperture at the 4-hour mark. The watch has a tough appearance, perfect for formal occasions. It also comes with a 2-year warranty and is water-resistant up to 50 meters.\n\nThe second option is the <a href=\"/11005\">Puma Men Visor 3HD Black Watch</a> priced at $54.95. It has a square dial with branding at the 7-hour mark and a date aperture at the 6-hour mark. This watch also has a tough design and is water-resistant up to 50 meters. It comes with a 2-year warranty as well.\n\nBoth watches are suitable for formal occasions and are priced under $50. You can click on the links to view more details and make a purchase. If you have any further questions, please let me know!",
  "error": null,
  "auth": "SES_54f211db-50a7-45df-8067-c3dc4272beb2"
}
```

## Logs

```js
userMessage =
  'I am looking for a watch, Can you recommend anything for formal occasions with price under 50 dollars?';

standaloneQuestion =
  'Can you recommend a watch for formal occasions with a price under 50 dollars?';

similarProducts = [
  {
    pageContent: ` Product details are as follows:
                      productId: 11006.
                      productDisplayName: Puma Men Race Luminous Black Chronograph Watch.
                      price: 7795 ... `,
    metadata: { productId: '11006' },
  },
  {
    pageContent: ` Product details are as follows:
                      productId: 11005.
                      productDisplayName: Puma Men Visor 3HD Black Watch.
                      price: 5495  ...`,
    metadata: { productId: '11005' },
  },
];

answer = `Yes, I can recommend a watch for formal occasions with a price under $50. We have two options available from Puma that might interest you.

 The first option is the <a href="/11006">Puma Men Race Luminous Black Chronograph Watch</a> priced at $77.95. It features a stylish black dial with branding at the 12-hour mark, three time displays, and a date aperture at the 4-hour mark. The watch has a tough appearance, perfect for formal occasions. It also comes with a 2-year warranty and is water-resistant up to 50 meters.

 The second option is the <a href="/11005">Puma Men Visor 3HD Black Watch</a> priced at $54.95. It has a square dial with branding at the 7-hour mark and a date aperture at the 6-hour mark. This watch also has a tough design and is water-resistant up to 50 meters. It comes with a 2-year warranty as well.

Both watches are suitable for formal occasions and are priced under $50. You can click on the links to view more details and make a purchase. 

If you have any further questions, please let me know!`;
```
