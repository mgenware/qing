/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const brCmd = 'npx playwright test --project=chromium';

export default {
  lint: 'eslint --max-warnings 0 --ext .ts .',
  r: brCmd,
  rt: `${brCmd} --debug`,
  rg: `${brCmd} -g`,
  rtg: `${brCmd} --debug -g`,
  ts: 'tsc --incremental -p tsconfig.json',
};
