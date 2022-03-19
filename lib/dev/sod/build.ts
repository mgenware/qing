/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import np from 'path';
import yaml from 'js-yaml';
import * as qdu from '@qing/devutil';
import * as cm from './common.js';
import * as go from './goUtil.js';
import * as ts from './tsUtil.js';

const yamlExt = '.yaml';

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

const input = process.argv.slice(2)[0];
if (!input) {
  print('No input.');
  process.exit(1);
}

function trimYAMLExtension(s: string): string {
  return s.substr(0, s.length - yamlExt.length);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const fullInput = qdu.sodPath(input + yamlExt);
    const rawSource = yaml.load(await mfs.readTextFileAsync(fullInput));
    if (typeof rawSource !== 'object' || Array.isArray(rawSource)) {
      throw new Error(`Source YAML must be an object. Got ${JSON.stringify(rawSource)}`);
    }

    // eslint-disable-next-line no-inner-declarations
    function getAttr(key: string): string | null {
      return cm.popDictAttribute(rawSource as Record<string, string>, key);
    }

    const srcDict = rawSource as cm.SourceDict;
    const relPath = np.relative(qdu.sodPath(), fullInput);
    const relPathWithoutYAMLExt = trimYAMLExtension(relPath);
    const inputFileName = np.basename(input);
    const pkgName = inputFileName;
    const webFile = np.join(qdu.webSodPath(), relPathWithoutYAMLExt) + '.ts';

    const goFileName = inputFileName + '.go';
    const goOutDir = getAttr(go.goOutDirAttr);
    let serverFile: string;
    if (goOutDir) {
      serverFile = np.join(qdu.serverPath(), goOutDir, goFileName);
    } else {
      // NOTE: Unlike .ts file, .go files are put in an extra folder named the same
      // as the extracted package name.
      serverFile = np.join(qdu.serverSodPath(), relPathWithoutYAMLExt, goFileName);
    }

    await Promise.all([
      mfs.writeFileAsync(serverFile, go.goCode(input, pkgName, srcDict)),
      mfs.writeFileAsync(webFile, ts.tsCode(input, srcDict)),
    ]);
    print('Files written:');
    print(serverFile);
    print(webFile);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
