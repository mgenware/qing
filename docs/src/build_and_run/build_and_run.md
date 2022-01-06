# Build and run

> Make sure you've run through all steps in [Prerequisites](prerequisites.md).

### Check out the source

```sh
git clone https://github.com/mgenware/qing
```

### Install `qing-dev` and `daizong-cli`

> `qing-dev` is a CLI tool to run qing-related scripts during development.
> `daizong-cli` is used to run [daizong](https://github.com/mgenware/daizong) tasks in a shorter way. `daizong` tasks are used in many projects in qing.

```sh
npm i qing-dev daizong-cli -g
```

## Create database schemas

> You can skip this step if your database is already set up correctly.

Run `qing migrate 1` to create the initial database schemas.

## Build and run

- Build localized strings `qing ls`.
- Build web project via `qing w`.
- Build and start server project via `qing s`.

Once server is up and running, go to `localhost:8000` to test Qing in browser.

## Troubleshooting building issues

- Error 1146: Table 'qing_dev_db.table_name' doesn't exist when visiting `localhost:8000`.
  - Some tables are missing in database. Make sure you've run database migrations.
- Command not found: qing
  - Run `npm i qing-dev -g` in terminal.
- Windows WSL2: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running
  - Go to Docker Desktop - Settings - Resources - WSL Integration - Make sure your host linux distro has WSL integration enabled.
