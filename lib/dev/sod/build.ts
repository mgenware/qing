/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import np from 'path';
import yaml from 'js-yaml';
import { sodPath, webSodPath, serverSodPath, serverPath } from '../common/common.js';
import * as cm from './common.js';
import * as go from './goUtil.js';
import * as ts from './tsUtil.js';

const yamlExt = '.yaml';

const input = process.argv.slice(2)[0];
if (!input) {
  console.log('No input.');
  process.exit(1);
}

function trimYAMLExtension(s: string): string {
  return s.substr(0, s.length - yamlExt.length);
}

function print(s: string) {
  console.log(s);
}

(async () => {
  try {
    const fullInput = sodPath(input + yamlExt);
    const rawSource = yaml.load(await mfs.readTextFileAsync(fullInput));
    if (typeof rawSource !== 'object' || Array.isArray(rawSource)) {
      throw new Error(`Source YAML must be an object. Got ${JSON.stringify(rawSource)}`);
    }

    function getAttr(key: string): string | null {
      return cm.getDictAttribute(rawSource as Record<string, string>, key);
    }

    const srcDict = rawSource as cm.SourceDict;
    const relPath = np.relative(sodPath(), fullInput);
    const relPathWithoutYAMLExt = trimYAMLExtension(relPath);
    const inputFileName = np.basename(input);
    const pkgName = inputFileName;
    const webFile = np.join(webSodPath(), relPathWithoutYAMLExt) + '.ts';

    const goFileName = inputFileName + '.go';
    const goOutDir = getAttr(go.goOutDirAttr);
    let serverFile: string;
    if (goOutDir) {
      serverFile = np.join(serverPath(), goOutDir, goFileName);
    } else {
      // NOTE: Unlike .ts file, .go files are put in an extra folder named the same as the extracted package name.
      serverFile = np.join(serverSodPath(), relPathWithoutYAMLExt, goFileName);
    }

    await Promise.all([
      mfs.writeFileAsync(serverFile, go.goCode(input, pkgName, srcDict)),
      mfs.writeFileAsync(webFile, ts.tsCode(input, srcDict)),
    ]);
    print(`Files written:`);
    print(serverFile);
    print(webFile);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
