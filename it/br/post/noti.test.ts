/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';
import { CmtFixtureWrapper } from 'br/cmt/common';
import { getEmail, newUser } from 'helper/user';
import * as mh from 'helper/mail';
import postCmtFixture from './postCmtFixture';
import * as def from 'base/def';
import * as act from '../cmt/actions';

const w = new CmtFixtureWrapper('Post', postCmtFixture);

w.test('Post noti', null, async ({ p }) => {
  // Create a post with a tmp user.
  await newUser(async (u) => {
    // Add a cmt with user1.
    await p.reload(br.usr.user);
    const cmtApp = await w.getCmtApp(p);
    await act.writeCmt(p, { cmtApp, content: def.sd.content });

    const postLink = w.getHostURL(p);
    const email = await getEmail(u);
    const mail = await mh.getLatest({ email });
    br.expect(mail.title).toBe(
      'USER has replied to your comment in "<p>title</p><script>alert(\'-39\')</script>".',
    );
    br.expect(mail.content.trim()).toBe(`<p>
<span>USER has replied to your comment in &#34;&lt;p&gt;title&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;&#34;.</span>
<a href="${postLink}">Click here to view it on Qing.</a>
</p>`);
  });
});
