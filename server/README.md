# qing.server

## Folder structure

- `a` shared application modules
- `da` DB code generated by mingru
- `dax` handwritten DB code
- `lib` library helpers
- `r` routes
- `s` services
- `sod` shared object definitions

## Naming conventions

We follow the standard Go naming conventions with some exceptions.

- Directory name can use snake_case for readability, e.g. `profile_api` as directory name, `profileapi` for package name.
- GET HTTP route modules use `page` or simply `p` as suffix. POST HTTP ones use `api` as suffix.
- URLs should use `-` instead of `_` as separators, e.g. prefer `new-post` over `new_post`.
- Some app modules have a `x` suffix to avoid conflicts with standard go modules. e.g. `logx`.

## Run server unit tests

```sh
QING_UT=1 go test ./...
```

## Development scripts

Spin up the server:

```sh
qing s default
```

Perform migrations:

```sh
# Apply N up migrations
qing migrate up <N>

# Apply N down migrations
qing migrate down <N>

# Migrate to version V
qing migrate goto <V>

# Drop everything in DB
qing migrate drop
```
