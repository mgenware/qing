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

const newPwd = '_new_pwd_456)(_';

it('ResetPwd - Success', async () => {
  await newUser(async (u) => {
    const { email } = u;
    await api(authAPI.forgotPwd, { email }, null);

    // Check verification email.
    const mail = await mh.getLatest({ email });
    assert.strictEqual(mail.title, 'Reset your password');
    assert.match(
      mail.content,
      /<p>Click the link below to reset your password\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/reset-pwd\/(.*?)" target="_blank">https:\/\/__qing__\/auth\/reset-pwd\/.*?<\/a><\/p>/,
    );

    // Visit the URL.
    const relURL = mh.getContentLink(mail.content);
    let verifyResp = await fetch(relURL);
    assert.ok(verifyResp.ok);

    // Reset password.
    await api(authAPI.resetPwd, { pwd: newPwd });
  });
});
