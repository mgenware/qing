/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api, apiRaw } from '@qing/dev/it/api.js';
import * as assert from 'node:assert';
import { newUser } from '@qing/dev/it/helper/user.js';
import * as authAPI from '@qing/routes/s/pub/auth.js';
import * as mh from '@qing/dev/it/helper/mail.js';

const keyValueRegex = /window.appPageExtra="(.+?)"/;
const initialPwd = '111111)(_';
const newPwd = '_new_pwd_456)(_';

it('ResetPwd - Success', async () => {
  await newUser(
    async (u) => {
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
      const verifyResp = await fetch(relURL);
      assert.ok(verifyResp.ok);

      const respHTML = await verifyResp.text();
      const key = respHTML.match(keyValueRegex)?.[1];
      assert.ok(key);

      // Reset password.
      await api(authAPI.resetPwd, { pwd: newPwd, key });

      // Sign in with old password.
      const invalidPwdRes = await apiRaw(authAPI.signIn, { email, pwd: initialPwd });
      assert.deepStrictEqual(invalidPwdRes, {
        c: 1,
        m: 'Invalid username or password.',
      });

      // Sign in with new password.
      await api(authAPI.signIn, { email, pwd: newPwd });
    },
    { pwd: initialPwd },
  );
});

it('ResetPwd - Revisit used link', async () => {
  await newUser(
    async (u) => {
      const { email } = u;
      await api(authAPI.forgotPwd, { email }, null);

      // Visit the URL.
      const mail = await mh.getLatest({ email });
      const relURL = mh.getContentLink(mail.content);
      const verifyResp = await fetch(relURL);
      assert.ok(verifyResp.ok);

      const respHTML = await verifyResp.text();
      const key = respHTML.match(keyValueRegex)?.[1];
      assert.ok(key);

      // Reset password.
      await api(authAPI.resetPwd, { pwd: newPwd, key });

      // Revisiting the verification link results in error.
      const failedResp = await fetch(relURL);
      assert.ok(failedResp.ok);
      assert.strictEqual(mh.getErrorContent(await failedResp.text()), 'Link has expired.');
    },
    { pwd: initialPwd },
  );
});
