## Microservice solutions using Redis

Sample Ecommerce application built to demonstrate redis solutions to solve common problems in microservice architecture.

Following are the Microservice tutorials referring this application :

- [Command and Query Responsibility Segregation](https://developer.redis.com/howtos/solutions/microservices/cqrs)
- [Microservices Communication with Redis streams](https://developer.redis.com/howtos/solutions/microservices/interservice-communication)

- [Query Caching](https://developer.redis.com/howtos/solutions/microservices/caching/)

- [API Gateway Caching](https://developer.redis.com/howtos/solutions/microservices/api-gateway-caching)

- [Digital Identity Validation](https://developer.redis.com/howtos/solutions/fraud-detection/digital-identity-validation/)

- [Transaction risk scoring](https://developer.redis.com/howtos/solutions/fraud-detection/transaction-risk-scoring/)

- [GenAI Chatbot](https://developer.redis.com/howtos/solutions/vector/gen-ai-chatbot)

## Tech stack

- Front end : built using nextJs and Tailwind
- Backend : built using express (nodejs)
- Database : Prisma (MongoDB, Postgresql ..etc) , Redis

## Manage application

### Start application

```sh
# to start docker app
docker compose up -d
```

- Open **"http://localhost:4200/"** in browser

Note:

- Can view MongoDB data in MongoDB compass at URI `mongodb://localhost:27017/dbFashion?directConnection=true`

  - If postgresql, connection url is `postgresql://prisma:prisma@localhost:5432/dbFashion?schema=public`

- Can view Redis data in [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) at localhost with port 6379

- Can change above connection details or ports by the environment variables in .env file

### Other commands

```sh
# to stop docker app
docker compose down

# to stop & also delete volumes (mongodb & redis data)
docker compose down -v

# to rebuild all images & start
docker compose  up -d --build

# to rebuild image of specific service (after any code changes)
docker-compose build --no-cache <service_name>
# example
docker-compose build --no-cache orders-service
```

### To change Database

1. Configure `DATABASE_URL` in root `.env` file

```sh
DATABASE_URL=mongodb://mongodb-server:27017/dbFashion
# OR
DATABASE_URL="postgresql://prisma:prisma@postgresql-server:5432/dbFashion?schema=public"
```

2. Run specific db schema generation

```sh
npm run mongodb-schema
# OR
npm run relational-schema
```

Note : above command copies database prisma schema file to various services (orders, payments..etc) and generate prisma types

3. Start docker

```sh
docker compose up -d --build
```

### View database

-For MongoDB, [download mongodb compass](https://www.mongodb.com/try/download/compass) and connect with url `mongodb://localhost:27017/dbFashion?directConnection=true`

- For postgresql, connection url is `postgresql://prisma:prisma@localhost:5432/dbFashion?schema=public`

  - Current application contains pg admin GUI (docker) for postgres, if you want to use same then perform following

    1.  open **http://localhost:5200/** in browser & enter below details

    ```yml
    email: user@domain.com
    password: password
    ```

    2.  Add new db server -> connection details

    ```yml
    hostname: host.docker.internal
    port: 5432
    username: prisma
    password: prisma
    ```

### Repo formatting

Run prettier on all the files with the following:

```sh
npm i

npm run format
```

## API docs

All API docs are available at /docs/api folder

## Database Product list

Smaller dataset of products is used for the demo, but refer [database docs](./database/readme.md) to add larger dataset easily

## Main folder structure

- cdn : Contains product images to be served to client (UI)
- client : frontend of the application
- database : To seed initial products data
- docs : API documentation
- **server/** :
  - **services** : Some microservices of ecommerce app
  - **api-gateway** : Sample http proxy in-front of micro services
  - **common** : Shared files among microservices

## Screenshots

### Product

- `Dashboard`: Shows the list of products with search functionality

  ![redis microservices e-commerce app frontend products page](./docs/images/app-design/01-dashboard.png)

- `Chat bot`: The chat bot is available on the bottom right corner of the page. It can be used to search for products and view the product details.

  ![redis microservices e-commerce app frontend chat bot](./docs/images/app-design/02-ai-bot.png)

  Clicking on a product in the chat shows the product details on dashboard

  ![redis microservices e-commerce app frontend product details](./docs/images/app-design/03-ai-bot-product.png)

- `Shopping Cart`: Add products to the cart, then check out using the "Buy Now" button ![redis microservices e-commerce app frontend shopping cart](./docs/images/app-design/04-shopping-cart.png)

- `Order history`: Once an order is placed, the `Orders` link in the top navigation bar shows the order status and history

  ![redis microservices e-commerce app frontend order history page](./docs/images/app-design/05-order-history.png)

- `Admin`: The `admin` link in the top navigation bar shows purchase stats and trending products.

  ![redis microservices e-commerce app frontend admin page](./docs/images/app-design/06-admin-charts.png) ![redis microservices e-commerce app frontend admin page](./docs/images/app-design/07-admin-top-trending.png)

- `Settings`: To control UI features

  ![Settings](./docs/images/app-design/08-settings.png)

and so on

### MongoDB

- **products table**

![products](./docs/images/order-transaction/db-mongodb-1-products.png)

- **orders table**

![orders](./docs/images/order-transaction/db-mongodb-2-orders.png)

- **orderProducts table**

![order-products](./docs/images/order-transaction/db-mongodb-3-order-products.png)

- **payments table**

![payments](./docs/images/order-transaction/db-mongodb-4-payments.png)

### Postgressql

- **products table**

![products](./docs/images/order-transaction/db-postgresql-1-products.png)

- **orders table**

![orders](./docs/images/order-transaction/db-postgresql-2-orders.png)

- **orderProducts table**

![order-products](./docs/images/order-transaction/db-postgresql-3-order-products.png)

- **payments table**

![payments](./docs/images/order-transaction/db-postgresql-4-payments.png)

### Redis

- **order-with-products**

![order-with-products](./docs/images/order-transaction/redis-1-order-with-products.png)

- **transaction-stream**

![transaction-stream](./docs/images/order-transaction/redis-2-transaction-stream.png)
