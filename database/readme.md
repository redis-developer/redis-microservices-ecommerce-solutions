This application seeds "products" collection data to mongodb database.

## Database seeder

Only ~100 products are added for the demo to keep repository size smaller but more items can be downloaded from [online fashion dataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset)

### After download

- Copy all or required json files from "fashion-dataset/styles" to "database/fashion-dataset/001/products/"

- Copy all or required images from "fashion-dataset/images" to "cdn/fashion-dataset/images/"

## Prisma schema

- On prisma schema change (locally), run following in `database`

```sh
# to upgrade db & generate schema
npm run schema
```

- Run specific db schema generation at `project root`

```sh
npm run mongodb-schema
# OR
npm run relational-schema
```

Note : above command copies database prisma schema file to various services (orders, payments..etc) and generate prisma types
