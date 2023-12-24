/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import * as def from 'base/def.js';
import * as cm from '../common.js';
import { getEmail, newUser } from 'helper/user.js';
import * as act from '../actions.js';
import * as mh from 'helper/mail.js';
import { Page } from '@playwright/test';
import { CmtFixture } from '../fixture.js';

export function testReplyNoti(w: CmtFixture, page: Page) {
  // Noti for root cmts are tested in individual post types.
  return w.start(page, {}, async ({ p }) => {
    await newUser(async (u) => {
      {
        {
          // Sign in with the tmp user.
          await p.reloadWithUser(u);
          // tmp user: creates a cmt.
          const cmtApp = await w.getCmtApp(p);
          await act.writeCmt(p, { cmtApp, content: def.sd.content });
        }
        {
          // user1: replies to it.
          await p.reloadWithUser(br.usr.user);
          const cmtApp = await w.getCmtApp(p);
          const postLink = w.getHostURL(p);

          const cmtEl = cm.getTopCmt({ cmtApp });
          await act.writeReply(p, { cmtEl, content: '123' });

          const cmtID = await cm.getCmtIDAsync({ cmtEl: cm.getNthReply({ cmtEl, index: 0 }) });

          const email = await getEmail(u);
          const mail = await mh.getLatest({ email });
          br.expect(mail.title).toBe(
            'USER has replied to your comment in "<p>title</p><script>alert(\'-39\')</script>".',
          );
          br.expect(mail.content.trim()).toBe(`<p>
  <span>USER has replied to your comment in &#34;&lt;p&gt;title&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;&#34;.</span>
  <a href="${postLink}?cmt=${cmtID}">Click here to view it on Qing.</a>
</p>`);
        }
      }
    });
  });
}
