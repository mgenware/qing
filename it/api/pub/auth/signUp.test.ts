/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw, ita, api, apiRaw } from 'api';
import * as authAPI from '@qing/routes/d/s/pub/auth';
import * as authRoute from '@qing/routes/d/auth';
import { expect } from 'expect';
import * as uuid from 'uuid';
import * as mailAPI from '@qing/routes/d/dev/api/mail';
import * as ml from 'helper/email';
import { serverURL } from 'base/def';
import fetch from 'node-fetch';
import { curUser, userInfo } from 'helper/user';
import CookieJar from 'helper/cookieJar';
import * as pageUtil from 'helper/page';

const pwd = '123456';
const htmlIDRegex = /window\.appVerifiedUID = '(.+)';/g;
const invalidNameOrPwdResp = {
  code: 1,
  msg: 'Invalid username or password',
};

itaResultRaw('Sign up - Missing name', authAPI.signUp, { email: '_', pwd: '_' }, null, {
  code: 1,
  msg: 'the argument `name` is required',
});

itaResultRaw('Sign up - Missing email', authAPI.signUp, { name: '_', pwd: '_' }, null, {
  code: 1,
  msg: 'the argument `email` is required',
});

itaResultRaw('Sign up - Missing pwd', authAPI.signUp, { name: '_', email: '_' }, null, {
  code: 1,
  msg: 'the argument `pwd` is required',
});

itaResultRaw(
  'Sign up - Min pwd length',
  authAPI.signUp,
  { name: '_', email: '_', pwd: '1' },
  null,
  {
    code: 1,
    msg: 'the argument `pwd` is less than the required length 6',
  },
);

const email1 = uuid.v4();
ita(
  'Sign up - Verification email - Cannot login when not verified',
  authAPI.signUp,
  { name: '_', email: email1, pwd },
  null,
  async (_) => {
    // Check verification email.
    const mail = await api<ml.MailResponse>(mailAPI.get, { email: email1 }, null);
    expect(mail.title).toBe('Verify your email');

    const mainEl = ml.getMainEmailContentElement(mail.content);
    const mainContentHTML = (mainEl?.innerHTML ?? '').trim();

    expect(mainContentHTML).toMatch(
      /<p>Click the link below to complete the registration process\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/verify-reg-email\/.*?" target="_blank">https:\/\/__qing__\/auth\/verify-reg-email\/.*?<\/a><\/p>/,
    );

    // Try to login.
    const loginRes = await apiRaw(authAPI.signIn, { email: email1, pwd });
    expect(loginRes).toEqual(invalidNameOrPwdResp);
  },
);

const email2 = uuid.v4();
ita(
  'Sign up - Verify email - Log in - Revisit verify link',
  authAPI.signUp,
  { name: 'New user', email: email2, pwd },
  null,
  async (_) => {
    // Check verification email.
    const mail = await api<ml.MailResponse>(mailAPI.get, { email: email2 }, null);
    const mainEl = ml.getMainEmailContentElement(mail.content);

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
    expect(pageUtil.getMainContentHTML(await verifyResp.text())).toBe(`<container-view>
  <div class="text-center">
    <h1 class="__qing_ls__">errOccurred</h1>
    <p class="text-danger">Link has expired, please sign up again.</p>
  </div>
</container-view>`);
  },
);

it('Sign up - Wrong email verification link', async () => {
  const verifyResp = await fetch(
    `${serverURL}${authRoute.verifyRegEmail}/bGlsaUBsaWxpLmNvbXw1YjRlMDM5MC1jNWY2LTRhNTEtYTQ4Zi1lNGViZGJjNDM0YWI`,
  );
  expect(verifyResp.status).toBe(503);
  expect(pageUtil.getMainContentHTML(await verifyResp.text())).toBe(`<container-view>
  <div class="text-center">
    <h1 class="__qing_ls__">errOccurred</h1>
    <p class="text-danger">Link has expired, please sign up again.</p>
  </div>
</container-view>`);
});
