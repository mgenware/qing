/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { Page, usr, Element } from 'br';
import * as cm from './common';
import * as act from './actions';

async function setupEnv(w: CmtFixtureWrapper, p: Page) {
  // This creates the following structure:
  // - cmt2
  // - cmt1
  //  - reply2
  //  - reply1
  //    - sub-reply1
  const cmtApp = await w.getCmtApp(p);
  for (let i = 0; i < 2; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeCmt(p, {
      cmtApp,
      content: `cmt${i + 1}`,
    });
  }
  const cmtEl = cm.getNthCmt({ cmtApp, index: 1 });
  for (let i = 0; i < 2; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeReply(p, {
      cmtEl,
      content: `reply${i + 1}`,
    });
  }
  await act.writeReply(p, {
    cmtEl: cm.getNthReply({ cmtEl, index: 1 }),
    content: 'sub-reply1',
  });
  return w.getHostURL(p);
}

async function checkFocusMode(cmtApp: Element) {
  // You cannot write a cmt in focus mode.
  await cmtApp.$qingButton('Write a comment').shouldNotExist();

  // Check `focus-mode` class is available, which adds border to cmt-app.
  await cmtApp.$('.focus-mode').shouldExist();
}

function testReply(w: CmtFixtureWrapper) {
  w.test('Focus reply', usr.user, async ({ p }) => {
    await setupEnv(w, p);
    await p.reload(null);

    const cmtApp = await w.getCmtApp(p);
    await checkFocusMode(cmtApp);

    let cmtEl = cm.getTopCmt({ cmtApp });
    await cm.shouldHaveCmtCount({ cmtApp, count: 5 });

    // Check cmt.
    await cm.shouldAppear({
      cmtEl,
      author: usr.user,
      content: 'cmt1',
    });
    await cm.shouldHaveReplyCount({ cmtEl, count: 2, shown: 1 });

    // Check reply.
    cmtEl = cm.getNthReply({ cmtEl, index: 0 });
    await cm.shouldAppear({
      cmtEl,
      author: usr.user,
      content: 'reply1',
    });
    await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 0 });

    // CLICKs
  });
}

export default function testFocusMode(w: CmtFixtureWrapper) {
  testReply(w);
}
