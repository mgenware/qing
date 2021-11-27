# Prerequisites

Qing supports building on Windows, macOS and Linux. You need to install the following dependencies on your host operating system to build Qing.

- Latest Docker
  - Windows users: Only Windows 10+ with WSL2 installed are supported.
- Latest Node.js LTS version

## Node.js version manager

It's recommended to use a Node.js version manager to quickly switch Node.js version in your local environment. [nvm](https://github.com/nvm-sh/nvm) and [n](https://github.com/tj/n).

### Windows WSL2 users

It's recommended to use [n](https://github.com/tj/n) instead of nvm on Windows WSL2. nvm has trouble running `node` or `npm` as root.

### Installing [n](https://github.com/tj/n)

Refer to n installation [docs](https://github.com/tj/n#installation) for installation. Some notes:

- n can be installed when `npm` is not available
- Installing n might need root access. But you **should NOT** install npm global modules (including n) as root.
- If you encountered any permission issues running `npm add -g <package>`, you should take ownership of some system directories as shown below.

<blockquote>

Quote from n installation [docs](https://github.com/tj/n#installation), use the following commands to take ownership of some system directories:

```
### https://github.com/tj/n#installation ###

# make cache folder (if missing) and take ownership
sudo mkdir -p /usr/local/n
sudo chown -R $(whoami) /usr/local/n
# make sure the required folders exist (safe to execute even if they already exist)
sudo mkdir -p /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share
# take ownership of Node.js install destination folders
sudo chown -R $(whoami) /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share
```

</blockquote>
