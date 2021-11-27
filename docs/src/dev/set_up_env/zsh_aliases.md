# ZSH aliases

It's recommended to set up a ZSH alias to run [daizong](https://github.com/mgenware/daizong) scripts, this can come handy when you need to run various scripts of Qing.

Add the following line to your `~/.zshrc`:

```sh
alias dz="npm run r"
```

Reload your terminal session. Now you can use `dz` to start [daizong](https://github.com/mgenware/daizong) scripts. For example, suppose the following `daizong.config.js`:

```js
export default {
  dev: 'tsc -b src -w',
};
```

You can do `dz dev` instead of `npm run r dev`.
