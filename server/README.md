# qing.server

## Folder structure

- `app` shared application modules
- `da` data access layer
- `fx` internal modules
- `lib` library related helpers
- `mingru` data access source files
- `r` routes

## Naming conventions

We strictly follow the standard Go naming conventions with some additions.

- Directory name can use snake_case for readability, e.g. `profile_api` as directory name, `profileapi` for package name.
- All `GET` requests use `page` or simply `p` as suffix, all `POST` requests use `api` as suffix.
- URLs should use `-` instead of `_` as separators, e.g. prefer `new-post` over `new_post`.
- Some app modules have a `x` as suffix, e.g. `logx`, to avoid conflicts with standard go modules.

## Development scripts

Spin up the server:

```sh
docker compose up
```

Perform migrations:

```sh
# Apply N up migrations
docker compose run migrate up <N>

# Apply N down migrations
docker compose run migrate down <N>

# Migrate to version V
docker compose run migrate goto <V>

# Drop everything in DB
docker compose run migrate drop
```

## Run tests

Run server unit tests:

```sh
Q_TEST=/qing/userland/test.json go test ./...
```

To run a specific test:

```sh
# cd to the directory of the test you want to run.
Q_TEST=/qing/userland/test.json go test . -v -count=1
```
