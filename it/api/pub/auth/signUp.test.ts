/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw, ita, api, apiRaw } from 'api';
import * as authAPI from '@qing/routes/d/s/pub/auth';
import { expect } from 'expect';
import * as uuid from 'uuid';
import * as mailAPI from '@qing/routes/d/dev/api/mail';
import * as ml from 'helper/mail';
import { serverURL } from 'base/def';
import fetch from 'node-fetch';
import { curUser, userInfo } from 'helper/user';
import CookieJar from 'helper/cookieJar';

const pwd = '123456';

itaResultRaw('Sign up - Missing name', authAPI.signUp, { email: '_', pwd: '_' }, null, {
  code: 10000,
  msg: 'the argument `name` is required',
});

itaResultRaw('Sign up - Missing email', authAPI.signUp, { name: '_', pwd: '_' }, null, {
  code: 10000,
  msg: 'the argument `email` is required',
});

itaResultRaw('Sign up - Missing pwd', authAPI.signUp, { name: '_', email: '_' }, null, {
  code: 10000,
  msg: 'the argument `pwd` is required',
});

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

    const mainEl = ml.getMailContentElement(mail.content);
    const mainContentHTML = (mainEl?.innerHTML ?? '').trim();

    expect(mainContentHTML).toMatch(
      /<p>Click the link below to complete the registration process\.<\/p>\n<p><a href="https:\/\/__qing__\/auth\/verify-reg-email\/.*?" target="_blank">https:\/\/__qing__\/auth\/verify-reg-email\/.*?<\/a><\/p>/,
    );

    // Try to login.
    const loginRes = await apiRaw(authAPI.signIn, { email: email1, pwd });
    expect(loginRes).toEqual({ code: 1 });
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
    const mainEl = ml.getMailContentElement(mail.content);

    // Verify email.
    const absURL = mainEl?.querySelector('a')?.textContent.trim() ?? '';
    expect(absURL).toBeTruthy();
    const idx = absURL.indexOf('/auth/verify-reg-email/');
    const relURL = `${serverURL}${absURL.substring(idx)}`;

    // Visit verification URL.
    const verifyResp = await fetch(relURL);
    expect(verifyResp.ok).toBeTruthy();
    // `resp.url` should be the redirected profile URL, example: `http://localhost:8000/u/`.
    expect(verifyResp.url.startsWith('http://localhost:8000/u/')).toBeTruthy();
    const uid = verifyResp.url.substring('http://localhost:8000/u/'.length);
    expect(uid).toBeTruthy();

    // Verify new user name.
    const uInfo = await userInfo(uid);
    expect(uInfo?.name).toBe('New user');

    const cookieJar = new CookieJar();
    await api(authAPI.signIn, { email: email2, pwd }, null, { cookieJar });
    expect(await curUser(cookieJar)).toBe(uid);

    // Visit verification link again results in error.
  },
);
