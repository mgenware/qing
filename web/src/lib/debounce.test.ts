/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'dev/t.js';
import debounce from './debounce.js';
import delay from './delay.js';

it('Debounce', async () => {
  let count = 0;

  const f = debounce(50, () => {
    count++;
  });

  f();
  f();
  f();

  await delay(20);
  f();
  expect(count).to.eq(0);
  f();

  await delay(50);
  expect(count).to.eq(1);
});
