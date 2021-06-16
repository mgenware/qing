# qing.server

## Naming convensions

We strictly follow the standard Go naming conventions with some additions.

- Directory name can use snake_case for readability, e.g. `profile_api` as directory name, `profileapi` for package name.
- All `GET` requests use `page` or simply `p` as suffix, all `POST` requests use `api` as suffix.
- App-wide components use `x` as suffix, e.g. `logx`.
- URLs should use `-` instead of `_` as separators, e.g. prefer `new-post` over `new_post`.
- Some frequently used abbrs
  - `sr` service restricted: APIs require user logged in
  - `t` testing
  - `da` data access
  - `fx` frameworks

## Run tests

To run all unit tests

```sh
Q_TEST=/qing/userland/test.json go test ./...
```

To run an specific test:

```sh
# cd to the directory of the test you want to run.
Q_TEST=/qing/userland/test.json go test . -v -count=1
```
