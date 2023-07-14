/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw, ita, api, apiRaw } from 'api.js';
import * as authAPI from '@qing/routes/s/pub/auth.js';
import * as authRoute from '@qing/routes/auth.js';
import * as assert from 'node:assert';
import * as mh from 'helper/mail.js';
import { serverURL } from 'base/def.js';
import fetch from 'node-fetch';
import { curUser, newEmail, userInfo } from 'helper/user.js';
import CookieJar from 'helper/cookieJar.js';

const pwd = '123456';
const htmlIDRegex = /__brVerifiedUID_(.+)__/g;
const invalidNameOrPwdResp = {
  c: 1,
  m: 'Invalid username or password.',
};

itaResultRaw('Sign up - Missing name', authAPI.signUp, { email: '_', pwd: '_' }, null, {
  c: 1,
  m: 'the argument `name` is required',
});

itaResultRaw('Sign up - Missing email', authAPI.signUp, { name: '_', pwd: '_' }, null, {
  c: 1,
  m: 'the argument `email` is required',
});

itaResultRaw('Sign up - Missing pwd', authAPI.signUp, { name: '_', email: '_' }, null, {
  c: 1,
  m: 'the argument `pwd` is required',
});

itaResultRaw(
  'Sign up - Min pwd length',
  authAPI.signUp,
  { name: '_', email: '_', pwd: '1' },
  null,
  {
    c: 1,
    m: 'the argument `pwd` is less than the required length 6',
  },
);

const email1 = newEmail();
ita(
  'Sign up - Verification email - Cannot login when not verified',
  authAPI.signUp,
  { name: '_', email: email1, pwd },
  null,
  async (_) => {
    // Try to login without verifying.
    const loginRes = await apiRaw(authAPI.signIn, { email: email1, pwd });
    assert.deepStrictEqual(loginRes, invalidNameOrPwdResp);
  },
);

const email2 = newEmail();
ita(
  'Sign up - Verify email - Log in - Success',
  authAPI.signUp,
  { name: 'New user', email: email2, pwd },
  null,
  async (_) => {
    // Check verification email.
    const mail = await mh.getLatest({ email: email2 });
    const relURL = mh.getContentLink(mail.content);

    assert.strictEqual(mail.title, 'Verify your email');
    assert.match(
      mail.content,
      /<p>Click the link below to complete the registration process\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/verify-reg-email\/(.*?)" target="_blank">https:\/\/__qing__\/auth\/verify-reg-email\/.*?<\/a><\/p>/,
    );

    // Visit verification URL.
    let verifyResp = await fetch(relURL);
    assert.ok(verifyResp.ok);

    // Extract new verified ID from response HTML.
    const respHTML = await verifyResp.text();
    const extractedID = htmlIDRegex.exec(respHTML)?.[1]?.toString() ?? '';
    assert.ok(extractedID);

    // Verify new user name.
    const uInfo = await userInfo(extractedID);
    assert.strictEqual(uInfo?.name, 'New user');

    const cookieJar = new CookieJar();
    await api(authAPI.signIn, { email: email2, pwd }, null, { cookieJar });
    assert.strictEqual(await curUser(cookieJar), extractedID);

    // Visit verification link again results in error.
    verifyResp = await fetch(relURL);
    assert.strictEqual(verifyResp.status, 503);
    assert.strictEqual(mh.getErrorContent(respHTML), 'Link has expired.');
  },
);

it('Sign up - Wrong email verification link', async () => {
  const verifyResp = await fetch(
    `${serverURL}${authRoute.verifyRegEmail}/bGlsaUBsaWxpLmNvbXw1YjRlMDM5MC1jNWY2LTRhNTEtYTQ4Zi1lNGViZGJjNDM0YWI`,
  );
  const respHTML = await verifyResp.text();

  assert.strictEqual(verifyResp.status, 503);
  assert.strictEqual(mh.getErrorContent(respHTML), 'Link has expired.');
});
