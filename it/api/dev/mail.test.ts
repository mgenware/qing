/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api } from 'api';
import { expect } from 'expect';
import * as uuid from 'uuid';
import * as mailAPI from '@qing/routes/d/dev/api/mails';

interface EmailRes {
  title: string;
  content: string;
}

it('Send mail and getDevMail', async () => {
  const email = `zzzUT-${uuid.v4()}`;

  for (let i = 0; i < 3; i++) {
    // These mails must be sent sequentially.
    // eslint-disable-next-line no-await-in-loop
    await api(
      mailAPI.send,
      { to: email, title: `TITLE ${i + 1}`, content: `CONTENT ${i + 1}` },
      null,
    );
  }

  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    const d = await api<EmailRes>(mailAPI.get, { email, idx: i }, null);
    expect(d).toEqual({
      title: `TITLE ${i + 1}`,
      content: `CONTENT ${i + 1}`,
    });
  }

  await api(mailAPI.eraseUser, { email }, null);
});
