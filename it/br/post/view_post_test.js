/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newTmpPost } from '../../helper/post_helper.js';
import { test, ass, usr } from '../t.js';

test('View post', async (br) => {
  await newTmpPost(usr.user, async (id) => {
    await br.goto(`/p/${id}`);
    const html = await br.content();
    ass.t(html.includes('&lt;p&gt;post_t&lt;/p&gt;'));
    ass.t(html.includes('<p>post_c</p>'));
  });
});
