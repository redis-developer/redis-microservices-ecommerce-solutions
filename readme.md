## Microservice solutions using Redis

Sample Ecommerce application built to demonstrate redis solutions to solve common problems in microservice architecture.

Following are the Microservice tutorials referring this application :

- [Command and Query Responsibility Segregation](https://developer.redis.com/howtos/solutions/cqrs)
- [Microservices Communication with Redis streams](https://developer.redis.com/howtos/solutions/interservice-communication)

- [Query Caching](https://developer.redis.com/howtos/solutions/caching)

- [API Gateway Caching](https://developer.redis.com/howtos/solutions/api-gateway-caching)

## Tech stack

- Front end : built using nextJs and Tailwind
- Backend : built using express (nodejs)
- Database : MongoDB , Redis

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

- [createOrder](docs/api/create-order.md)
- [viewOrderHistory](docs/api/view-order-history.md)
- [getProductsByFilter](docs/api/get-products-by-filter.md)

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

## Local Development ( if prisma schema changes)

1. Configure `DATABASE_URL` in root `.env` file

```sh
DATABASE_URL=mongodb://mongodb-server:27017/dbFashion
# OR
DATABASE_URL="postgresql://prisma:prisma@postgresql-server:5432/dbFashion?schema=public"
```

2. Run anyone db schema generation

```sh
npm run mongodb-schema
# OR
npm run relational-schema
```

3. Start docker `docker compose up -d --build`
