/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api } from 'api.js';
import * as assert from 'node:assert';
import { newUser } from 'helper/user.js';
import * as authAPI from '@qing/routes/s/pub/auth.js';
import * as mh from 'helper/mail.js';

it('ResetPwd - Success', async () => {
  await newUser(async (u) => {
    const { email } = u;
    await api(authAPI.forgotPwd, { email }, null);

    const mail = await mh.getLatest({ email });
    assert.strictEqual(mail.title, 'Reset your password');

    const mainEl = mh.getMainEmailContentElement(mail.content);
    const mainContentHTML = (mainEl?.innerHTML ?? '').trim();

    assert.match(
      mainContentHTML,
      /<p>Click the link below to reset your password\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/verify-reg-email\/.*?" target="_blank">https:\/\/__qing__\/auth\/verify-reg-email\/.*?<\/a><\/p>/,
    );
  });
});
