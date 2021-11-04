# Building Qing

## Prerequisites

Qing supports building on Windows, macOS and Linux. You need to install the following softwares on you host operating system to build Qing.

- Latest Docker
  - Windows users: Only Windows 10 or higher with WSL2 installed are supported
- Latest Node.js LTS version

### Check out the source

```sh
git clone https://github.com/mgenware/qing
```

### Install `qing-dev`

> `qing-dev` is a CLI to run commands during development.

```sh
npm i qing-dev -g
```

### Install and Configure VSCode [Optional]

> It's highly recommended to use VSCode for development since Qing comes with a VSCode workspace to help you get your VSCode environment set up in seconds.

- Install VSCode.
- Navigate to project root directory in terminal.
- Open the VSCode workspace file by running `code qing.code-workspace` in terminal.
- VSCode should prompt you to install recommended extensions from workspace, click "Install".

## Build from the source

- Navigate to the project root directory in terminal.
- Set up database and migrations (You can skip this step if your database is already set up correctly)
  - Run `qing migrate 1`.
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
