# qing.server

## Naming convensions

We strictly follow the standard Go naming convension with some additions.

- Directory name can use snake_case for readability, e.g. `profile_api` as directory name, `profileapi` for package name.
- All `GET` requests use `page` or simply `p` as suffix, all `POST` requests use `api` as suffix.
- App-wide components use `x` as suffix, e.g. `logx`.
- Some frequently used abbrs
  - `sr` service restricted: APIs require user logged in
  - `t` testing
  - `da` data access
  - `fx` frameworks
