# API tests

Qing API tests are stored under `/it/api`. They test all backend APIs with different credentials.

## Run API tests locally

- Make sure server is running.
- Build integration tests `qing it`.
- Run API tests `qing it api`.
  - To run a specific API test by name: `qing it api -g "<regex>"`
