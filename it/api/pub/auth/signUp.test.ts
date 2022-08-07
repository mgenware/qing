/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itaResultRaw, ita, api } from 'api';
import * as authAPI from '@qing/routes/d/s/pub/auth';
import { expect } from 'expect';
import * as uuid from 'uuid';
import * as mailAPI from '@qing/routes/d/dev/api/mail';
import * as ml from 'helper/mail';

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

const newEmail = uuid.v4();
ita(
  'Sign up - Verification email',
  authAPI.signUp,
  { name: '_', email: newEmail, pwd: '123456' },
  null,
  async (_) => {
    // Check verification email.
    const mail = await api<ml.MailResponse>(mailAPI.get, { email: newEmail }, null);
    expect(mail.title).toBe('Verify your email');

    // Email content contains randomly generated URLs, use `startsWith` instead of `equals`.
    expect(
      ml
        .getMailContentHTML(mail.content)
        .startsWith(
          '<p>Click the link below to complete the registration process.</p>\n<p><a href="/auth/verify-reg-email/',
        ),
    ).toBeTruthy();
  },
);
