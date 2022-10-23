/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import * as br from 'br';
import * as def from 'base/def';
import * as cm from './common';
import { getEmail, newUser } from 'helper/user';
import * as act from './actions';
import * as mh from 'helper/mail';

export default function testReplyNoti(w: CmtFixtureWrapper) {
  // Noti for root cmts are tested in individual post types.
  w.test('Send a noti when replying to another cmt', null, async ({ p }) => {
    await newUser(async (u) => {
      {
        {
          // Sign in with the tmp user.
          await p.reload(u);
          // tmp user: creates a cmt.
          const cmtApp = await w.getCmtApp(p);
          await act.writeCmt(p, { cmtApp, content: def.sd.content });
        }
        {
          // user1: replies to it.
          await p.reload(br.usr.user);
          const cmtApp = await w.getCmtApp(p);

          const cmtEl = cm.getTopCmt({ cmtApp });
          await act.writeReply(p, { cmtEl, content: '123' });

          const email = await getEmail(u);
          const mail = await mh.getLatest({ email });
          br.expect(mail.title).toBe(
            'USER has replied to your comment in "<p>title</p><script>alert(\'-39\')</script>".',
          );
          br.expect(mail.content).toBe(`<p>
  <span>USER has replied to your comment in &#34;&lt;p&gt;title&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;&#34;.</span>
  <a href="/p/234?cmt=2xn">Click here to view it on Qing.</a>
</p>`);
        }
      }
    });
  });
}
