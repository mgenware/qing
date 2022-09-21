# css

This directory contains most CSS files. It will be mounted in docker in dev mode.

## `base.css` (from `qing-base-css`)

`base.css` is copied to this directory on dev mode as files in `node_modules` are symbolic links that are not mounted in docker.
