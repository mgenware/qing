/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { call } from 'api';
import { expect } from 'expect';
import * as uuid from 'uuid';
import * as apiMail from '@qing/routes/d/dev/api/mail';

interface EmailRes {
  title: string;
  content: string;
}

it('Send mail and getDevMail', async () => {
  const email = `zzzUT-${uuid.v4()}`;

  for (let i = 0; i < 3; i++) {
    // These mails must be sent sequentially.
    // eslint-disable-next-line no-await-in-loop
    await call(
      apiMail.send,
      { to: email, title: `TITLE ${i + 1}`, content: `CONTENT ${i + 1}` },
      null,
    );
  }

  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    const apiRes = await call(apiMail.get, { email, idx: i }, null);
    const d = apiRes.d as EmailRes;
    expect(d).toEqual({
      title: `TITLE ${i + 1}`,
      content: `CONTENT ${i + 1}`,
    });
  }
});
