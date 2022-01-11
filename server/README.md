# qing.server

## Folder structure

- `a` shared application modules
- `da` data access layer
- `fx` internal modules
- `lib` library helpers
- `r` routes
- `s` services
- `sod` shared object definitions

## Naming conventions

We usually follow the standard Go naming conventions with some additions.

- Directory name can use snake_case for readability, e.g. `profile_api` as directory name, `profileapi` for package name.
- GET HTTP route modules use `page` or simply `p` as suffix, POST HTTP route ones use `api` as suffix.
- URLs should use `-` instead of `_` as separators, e.g. prefer `new-post` over `new_post`.
- Some app modules have a `x` as suffix to avoid conflicts with standard go modules. e.g. `logx`.

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
