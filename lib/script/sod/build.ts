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
import * as qdu from '@qing/dev/util.js';
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

// `input`: `a/b` indicating `sod/a/b.yaml`.
async function build(input: string) {
  const fullInput = qdu.sodPath(input + yamlExt);
  const rawSource = yaml.load(await mfs.readTextFileAsync(fullInput));
  if (typeof rawSource !== 'object' || Array.isArray(rawSource)) {
    throw new Error(`Source YAML must be an object. Got ${JSON.stringify(rawSource)}`);
  }
  const srcDict = rawSource as cm.SourceDict;
  const fileName = np.basename(input);
  const pkgName = fileName + 'Sod';
  // Example: `sod/a/b.ts`.
  const webFile = np.join(qdu.webSodPath(), input) + '.ts';

  // NOTE: Unlike .ts file, .go files are put in an extra folder named the same
  // as the extracted package name.
  // Example: `sod/a/bSod/b.go`.
  const serverFile = np.join(qdu.serverSodPath(), input + 'Sod', fileName + '.go');

  await Promise.all([
    mfs.writeFileAsync(serverFile, go.goCode(input, pkgName, srcDict)),
    mfs.writeFileAsync(webFile, ts.tsCode(input, srcDict)),
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
