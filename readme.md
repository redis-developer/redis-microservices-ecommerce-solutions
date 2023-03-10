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

- Can view MongoDB data in MongoDB compass at URI "mongodb://localhost:27017"
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
docker-compose build --no-cache orders_service
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
