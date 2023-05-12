/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as assert from 'node:assert';
import * as mh from 'helper/mail.js';
import { newEmail } from 'helper/user.js';

it('Send mail and getDevMail', async () => {
  const email = newEmail();

  for (let i = 0; i < 3; i++) {
    // These mails must be sent sequentially.
    // eslint-disable-next-line no-await-in-loop
    await mh.sendRealMail({ to: email, title: `TITLE ${i + 1}`, content: `CONTENT ${i + 1}` });
  }

  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    const d = await mh.getLatest({ email, index: i });
    // Extract title and content data. ID and TS are ignored as they are time-based.
    assert.deepStrictEqual(
      { title: d.title, content: d.content },
      {
        title: `TITLE ${i + 1}`,
        content: `CONTENT ${i + 1}`,
      },
    );
  }

  await mh.erase({ email });
});
