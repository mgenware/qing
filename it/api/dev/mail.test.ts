/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import * as uuid from 'uuid';
import * as mh from 'helper/mail';

it('Send mail and getDevMail', async () => {
  const email = `zzzUT-${uuid.v4()}`;

  for (let i = 0; i < 3; i++) {
    // These mails must be sent sequentially.
    // eslint-disable-next-line no-await-in-loop
    await mh.send({ to: email, title: `TITLE ${i + 1}`, content: `CONTENT ${i + 1}` });
  }

  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    const d = mh.getLatest({ email, index: i });
    expect(d).toEqual({
      title: `TITLE ${i + 1}`,
      content: `CONTENT ${i + 1}`,
    });
  }

  await mh.erase({ email });
});
