#!/usr/bin/env node
const { sanitize } = require('ting');
const mfs = require('m-fs');
const argv = require('yargs').argv;

(async () => {
  if (argv.ping) {
    console.log('pong');
    process.exit(sanitize ? 0 : 1);
    return;
  }
  
  if (!argv.src || !argv.dest) {
    throw new Error('--src and --dest params must be present');
  }

  const src = await mfs.readFileAsync(argv.src, 'utf8');
  const sanitized = sanitize(src);
  await mfs.writeFileAsync(argv.dest, sanitized);
})();
