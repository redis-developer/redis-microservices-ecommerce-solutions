This application seeds "products" collection data to database.

## Database seeder

Only 1000 products are added for the demo to keep repository size smaller but more items can be downloaded from [fashion-dataset-formatter](https://github.com/PrasanKumar93/fashion-dataset-formatter)

### After download

- Copy all or required folders from from "fashion-dataset-formatter/products/" to current repo "cdn/fashion-dataset/products/" and restart the docker application

Note : Each folder like 01, 02, 03..etc has 1000 products

## Prisma schema

- On prisma schema change if any (locally), run following in `database`

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
