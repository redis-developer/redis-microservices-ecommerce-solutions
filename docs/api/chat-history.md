# getChatHistory

## Request

```json
POST http://localhost:3000/products/getChatHistory
```

## Response

```json
{
 "data":[
        {
            "sender":"User",
            "message":"I am looking for a watch, Can you recommend anything for formal occasions with price under 50 dollars?"
        },
        {
            "sender":"Assistant",
            "message":"I recommend two watches for formal occasions with a price under $50.

             First, we have the <a href="/?productId=11005">Puma Men Visor 3HD Black Watch</a> priced at $54.95. This watch features a heavy-duty design with a stylish dial and chunky casing, giving it a tough appearance - perfect for navigating the urban jungle. It has a square dial shape and a 32 mm case diameter. The watch comes with a 2-year warranty and is water-resistant up to 50 meters.

             Second, we have the <a href="/?productId=11006">Puma Men Race Luminous Black Chronograph Watch</a> priced at $77.95. This watch also features a heavy-duty design with a stylish dial and chunky casing. It has a round dial shape and a 40 mm case diameter. The watch comes with a 2-year warranty and is water-resistant up to 50 meters.

             Both these watches from Puma are perfect for formal occasions and are priced under $50. I hope this helps, and please let me know if you have any other questions!"
        }
    ],
  "error": null
}
```
