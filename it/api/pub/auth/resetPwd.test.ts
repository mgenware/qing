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

const emailLinkRegex =
  /<p>Click the link below to complete the registration process\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/reset-pwd\/(.*?)" target="_blank">https:\/\/__qing__\/auth\/reset-pwd\/.*?<\/a><\/p>/;

it('ResetPwd - Success', async () => {
  await newUser(async (u) => {
    const { email } = u;
    await api(authAPI.forgotPwd, { email }, null);

    const mail = await mh.getLatest({ email });
    assert.strictEqual(mail.title, 'Reset your password');

    const mainContentHTML = mh.getContentHTML(mail.content);

    assert.match(mainContentHTML, emailLinkRegex);
  });
});
