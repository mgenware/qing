/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw, ita, api, apiRaw } from 'api.js';
import * as authAPI from '@qing/routes/s/pub/auth.js';
import * as authRoute from '@qing/routes/auth.js';
import { expect } from 'expect';
import * as mh from 'helper/mail.js';
import { serverURL } from 'base/def.js';
import fetch from 'node-fetch';
import { curUser, newEmail, userInfo } from 'helper/user.js';
import CookieJar from 'helper/cookieJar.js';
import * as pageUtil from 'helper/page.js';

const pwd = '123456';
const htmlIDRegex = /window\.appVerifiedUID = '(.+)';/g;
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
    // Check verification email.
    const mail = await mh.getLatest({ email: email1 });
    expect(mail.title).toBe('Verify your email');

    const mainEl = mh.getMainEmailContentElement(mail.content);
    const mainContentHTML = (mainEl?.innerHTML ?? '').trim();

    expect(mainContentHTML).toMatch(
      /<p>Click the link below to complete the registration process\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/verify-reg-email\/.*?" target="_blank">https:\/\/__qing__\/auth\/verify-reg-email\/.*?<\/a><\/p>/,
    );

    // Try to login.
    const loginRes = await apiRaw(authAPI.signIn, { email: email1, pwd });
    expect(loginRes).toEqual(invalidNameOrPwdResp);
  },
);

const linkExpiredHTML = mh.unsafeErrorHTML('Link has expired, please sign up again.');

const email2 = newEmail();
ita(
  'Sign up - Verify email - Log in - Revisit verify link',
  authAPI.signUp,
  { name: 'New user', email: email2, pwd },
  null,
  async (_) => {
    // Check verification email.
    const mail = await mh.getLatest({ email: email2 });
    const mainEl = mh.getMainEmailContentElement(mail.content);

    // Verify email.
    const absURL = mainEl?.querySelector('a')?.textContent.trim() ?? '';
    expect(absURL).toBeTruthy();
    const idx = absURL.indexOf(authRoute.verifyRegEmail);
    const relURL = `${serverURL}${absURL.substring(idx)}`;

    // Visit verification URL.
    let verifyResp = await fetch(relURL);
    expect(verifyResp.ok).toBeTruthy();
    // Extract new verified ID from response HTML.
    const respHTML = await verifyResp.text();
    const extractedID = htmlIDRegex.exec(respHTML)?.[1]?.toString() ?? '';
    expect(extractedID).toBeTruthy();

    // Verify new user name.
    const uInfo = await userInfo(extractedID);
    expect(uInfo?.name).toBe('New user');

    const cookieJar = new CookieJar();
    await api(authAPI.signIn, { email: email2, pwd }, null, { cookieJar });
    expect(await curUser(cookieJar)).toBe(extractedID);

    // Visit verification link again results in error.
    verifyResp = await fetch(relURL);
    expect(verifyResp.status).toBe(503);
    expect(pageUtil.getMainContentHTML(await verifyResp.text())).toBe(linkExpiredHTML);
  },
);

it('Sign up - Wrong email verification link', async () => {
  const verifyResp = await fetch(
    `${serverURL}${authRoute.verifyRegEmail}/bGlsaUBsaWxpLmNvbXw1YjRlMDM5MC1jNWY2LTRhNTEtYTQ4Zi1lNGViZGJjNDM0YWI`,
  );
  expect(verifyResp.status).toBe(503);
  expect(pageUtil.getMainContentHTML(await verifyResp.text())).toBe(linkExpiredHTML);
});
