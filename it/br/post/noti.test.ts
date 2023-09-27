/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import { CmtFixtureWrapper } from 'br/cmt/common.js';
import { getEmail } from 'helper/user.js';
import * as mh from 'helper/mail.js';
import postCmtFixture from './postCmtFixture.js';
import * as def from 'base/def.js';
import * as act from '../cmt/actions.js';
import * as cm from '../cmt/common.js';

const w = new CmtFixtureWrapper('Post', postCmtFixture);

w.test('Post noti', { author: 'new', viewer: br.usr.user }, async ({ p, author }) => {
  const cmtApp = await w.getCmtApp(p);
  await act.writeCmt(p, { cmtApp, content: def.sd.content });
  const cmtID = await cm.getCmtIDAsync({ cmtEl: cm.getTopCmt({ cmtApp }) });

  const postLink = w.getHostURL(p);
  const email = await getEmail(author);
  const mail = await mh.getLatest({ email });
  br.expect(mail.title).toBe(
    'USER has replied to your post "<p>title</p><script>alert(\'-39\')</script>".',
  );
  br.expect(mail.content.trim()).toBe(`<p>
  <span>USER has replied to your post &#34;&lt;p&gt;title&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;&#34;.</span>
  <a href="${postLink}?cmt=${cmtID}">Click here to view it on Qing.</a>
</p>`);
});

w.test('Post noti - bot', { author: 'new-bot', viewer: br.usr.user }, async ({ p, author }) => {
  const cmtApp = await w.getCmtApp(p);
  await act.writeCmt(p, { cmtApp, content: def.sd.content });

  const email = await getEmail(author);
  const mail = await mh.getLatest({ email });
  br.expect(mail).toBeNull();
});
