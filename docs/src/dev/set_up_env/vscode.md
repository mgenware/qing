# Set up VSCode

> Qing comes with a VSCode workspace to help you get your VSCode environment set up in seconds.

- Install VSCode.
- Navigate to project root directory in terminal.
- Open the VSCode workspace file by running `code qing.code-workspace` in terminal.
- VSCode should prompt you to install recommended extensions from workspace, click "Install".

## Optional setup for VSCode

- To have Go language support in VSCode, you need to install Go and have `GOPATH` environment variable defined. An example of `GOPATH` in `.zshrc`:

```sh
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
```
