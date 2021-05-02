/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { it, ass } from '../t.js';

it('Home page', async (br) => {
  await br.goto('/');
  const c = await br.content();
  ass.t(c.length);
});
