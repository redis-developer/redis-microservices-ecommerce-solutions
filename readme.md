## Run application

```sh
# to start
docker compose up -d

# to stop
docker-compose down

# to rebuild image & start (after any code changes)
docker-compose up --build -d

# to stop & also delete volumes (mongodb & redis data)
docker-compose down -v
```

## API docs

- [create-order](docs/api/create-order.md)
- [view-order-history](docs/api/view-order-history.md)
