/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, ass } from 'base/br';

test('Home page', async (br) => {
  await br.goto('/', null);
  const c = await br.content();
  ass.t(c.length);
});
