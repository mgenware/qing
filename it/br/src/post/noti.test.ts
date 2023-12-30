/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import { test, expect } from '@playwright/test';
import { getEmail } from '@qing/dev/it/helper/user.js';
import * as mh from '@qing/dev/it/helper/mail.js';
import postCmtFixture from './postCmtFixture.js';
import * as def from '@qing/dev/it/base/def.js';
import * as act from '../cmt/actions.js';
import * as cm from '../cmt/common.js';

test('Post noti', async ({ page }) => {
  await postCmtFixture.start(
    page,
    { author: 'new', viewer: usr.user },
    async ({ p, author, fixture: w }) => {
      const cmtApp = await w.getCmtApp(p);
      await act.writeCmt(p, { cmtApp, content: def.sd.content });
      const cmtID = await cm.getCmtIDAsync({ cmtEl: cm.getTopCmt({ cmtApp }) });

      const postLink = w.getHostURL(p);
      const email = await getEmail(author);
      const mail = await mh.getLatest({ email });
      expect(mail.title).toBe(
        'USER has replied to your post "<p>title</p><script>alert(\'-39\')</script>".',
      );
      expect(mail.content.trim()).toBe(`<p>
  <span>USER has replied to your post &#34;&lt;p&gt;title&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;&#34;.</span>
  <a href="${postLink}?cmt=${cmtID}">Click here to view it on Qing.</a>
</p>`);
    },
  );
});

test('Post noti - bot', async ({ page }) => {
  await postCmtFixture.start(
    page,
    { author: 'new-bot', viewer: usr.user },
    async ({ p, author, fixture: w }) => {
      const cmtApp = await w.getCmtApp(p);
      await act.writeCmt(p, { cmtApp, content: def.sd.content });

      const email = await getEmail(author);
      const mail = await mh.getLatest({ email });
      expect(mail).toBeNull();
    },
  );
});
