/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import np from 'path';
import yaml from 'js-yaml';
import { globby } from 'globby';
import { deleteAsync } from 'del';
import * as qdu from '@qing/devutil';
import * as cm from './common.js';
import * as go from './goUtil.js';
import * as ts from './tsUtil.js';

const yamlExt = '.yaml';
const sodSrcDir = './sod/objects';

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

function cutYamlExt(s: string) {
  return s.substring(0, s.length - yamlExt.length);
}

const arg0 = process.argv.slice(2)[0];

// Injects a `Sod` suffix to the given name. As per Go conversions,
// package name should be the same as directory name.
// Example `post/postWind` -> `postSod/postWind`
function injectSodName(name: string) {
  const idx = name.lastIndexOf('/');
  if (idx < 0) {
    throw new Error(`No "/" found in SOD name "${name}"`);
  }
  return `${name.substring(0, idx)}Sod${name.substring(idx)}`;
}

async function build(name: string) {
  const fullInput = qdu.sodPath(name + yamlExt);
  const rawSource = yaml.load(await mfs.readTextFileAsync(fullInput));
  if (typeof rawSource !== 'object' || Array.isArray(rawSource)) {
    throw new Error(`Source YAML must be an object. Got ${JSON.stringify(rawSource)}`);
  }
  const srcDict = rawSource as cm.SourceDict;
  const relDir = np.dirname(name);
  const pkgName = np.basename(relDir) + 'Sod';
  const webFile = np.join(qdu.webSodPath(), name) + '.ts';

  // NOTE: Unlike .ts file, .go files are put in an extra folder named the same
  // as the extracted package name.
  const serverFile = np.join(qdu.serverSodPath(), injectSodName(name) + '.go');

  await Promise.all([
    mfs.writeFileAsync(serverFile, go.goCode(name, pkgName, srcDict)),
    mfs.writeFileAsync(webFile, ts.tsCode(name, srcDict)),
  ]);
  print('Files written:');
  print(serverFile);
  print(webFile);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    if (arg0) {
      await build(arg0);
    } else {
      const longFiles = await globby(`${sodSrcDir}/**/*.yaml`);
      /*
        Example output:
        'sod/objects/app/appRawSettings.yaml',
        'sod/objects/app/rawMainPageWind.yaml',
        'sod/objects/cmt/cmt.yaml',
      */
      const files = longFiles.map((f) => cutYamlExt(np.relative(sodSrcDir, f)));

      await deleteAsync([qdu.serverSodPath(), qdu.webSodPath()], { force: true });
      await Promise.all(files.map((f) => build(f)));
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
