# Browser tests

Qing browser tests are stored in `/it/br`. They are the most comprehensive tests in Qing, every feature must come with a browser test.

## Run browser tests locally

- Make sure server is running.
- Build integration tests `qing it`.
- Run browser tests `qing it br`.
  - To run a specific API test by name: `qing it br -g "<regex>"`

> NOTE: On Windows WSL2, you might need to run `sudo npx playwright install-deps` to install additional dependencies for playwright to run.

## Debug mode

To start browser tests in debug mode:

```sh
qing it br-t
```

To run a specific browser test in debug mode:

```sh
qing it br-t -g "<regex>"
```
