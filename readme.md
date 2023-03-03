### Run application

```sh
# to start
docker compose --profile backend up -d

# frontend static build depends on backend, so it needs to happen after
docker compose --profile frontend up -d
```

- Open **"http://localhost:4200/"** in browser

### Other commands

```sh
# to stop
docker compose --profile backend down

# to stop & also delete volumes (mongodb & redis data)
docker compose --profile backend down -v

# to rebuild image & start (after any code changes)
docker compose --profile backend --build up -d
```

Note:

- can change (external) environment variables in .env file if different ports to be used by application

## API docs

- [create-order](docs/api/create-order.md)
- [view-order-history](docs/api/view-order-history.md)
