/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page, usr, Element } from 'br.js';
import * as cm from '../common.js';
import * as act from '../actions.js';
import * as sh from 'br/com/overlays/share.js';
import { serverURL } from 'base/def.js';

async function addNestedCmts(w: cm.CmtFixtureWrapper, p: Page, linkName: string) {
  // This creates the following structure:
  // - cmt2
  // - cmt1
  //  - reply2
  //  - reply1
  //    - sub-reply1
  const cmtApp = await w.getCmtApp(p);
  let link = '';
  for (let i = 0; i < 2; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeCmt(p, {
      cmtApp,
      content: `cmt${i + 1}`,
    });
  }
  const cmtEl = cm.getNthCmt({ cmtApp, index: 1 });
  if (linkName === 'cmt') {
    await cmtEl.$linkButton('Share').click();
    link = await sh.getLink(p);
  }

  for (let i = 0; i < 2; i++) {
    // eslint-disable-next-line no-await-in-loop
    await act.writeReply(p, {
      cmtEl,
      content: `reply${i + 1}`,
    });
  }
  if (linkName === 'reply') {
    await cm.getNthReply({ cmtEl, index: 1 }).$linkButton('Share').click();
    link = await sh.getLink(p);
  }

  await act.writeReply(p, {
    cmtEl: cm.getNthReply({ cmtEl, index: 1 }),
    content: 'sub-reply1',
  });
  return link;
}

async function checkFocusMode(cmtApp: Element) {
  // You cannot write a cmt in focus mode.
  await cmtApp.$qingButton('Write a comment').shouldNotExist();

  // Check `focus-mode` class is available, which adds border to cmt-app.
  await cmtApp.$('.focus-mode').shouldExist();
}

function clickViewAllComments(cmtApp: Element) {
  return cmtApp.$linkButton('View all comments').click();
}

function removeCmtParams(link: string) {
  const url = new URL(link);
  url.searchParams.delete('cmt');
  return url.toString();
}

function addCmtParams(link: string, id: string) {
  const url = new URL(link);
  url.searchParams.set('cmt', id);
  return url.toString();
}

async function checkViewAllComments(w: cm.CmtFixtureWrapper, p: Page, cmtApp: Element) {
  await Promise.all([
    clickViewAllComments(cmtApp),
    p.waitForURL(removeCmtParams(`${serverURL}${w.getHostURL(p)}`)),
  ]);
}

function check404Content(cmtApp: Element) {
  return cmtApp
    .$('.focus-mode p')
    .e.toHaveText('The comment your are looking for is not found and might have been deleted.');
}

function testReply(w: cm.CmtFixtureWrapper) {
  w.test('Focus reply', { viewer: usr.user }, async ({ p }) => {
    const link = await addNestedCmts(w, p, 'reply');
    await p.gotoRaw(link, null);

    const cmtApp = await w.getCmtApp(p);
    await checkFocusMode(cmtApp);

    // There is no root `.br-children` in focus mode, get the first cmt-block instead.
    let cmtEl = cmtApp.$('cmt-block');
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

    // Click 1 reply.
    await cmtEl.$linkButton('1 reply').click();
    await cm.shouldHaveReplyCount({ cmtEl, count: 1, shown: 1 });
    await cm.shouldAppear({
      cmtEl: cm.getNthReply({ cmtEl, index: 0 }),
      author: usr.user,
      content: 'sub-reply1',
    });

    // Click more replies.
    cmtEl = cmtApp.$('cmt-block');
    await act.clickMoreReplies({ cmtEl });
    await cm.shouldHaveReplyCount({ cmtEl, count: 2, shown: 2 });

    // Re-check cmt count after loading replies.
    await cm.shouldHaveCmtCount({ cmtApp, count: 5 });

    // Click view all comments.
    await checkViewAllComments(w, p, cmtApp);
  });
}

function testCmt(w: cm.CmtFixtureWrapper) {
  w.test('Focus cmt', { viewer: usr.user }, async ({ p }) => {
    const link = await addNestedCmts(w, p, 'cmt');
    await p.gotoRaw(link, null);

    const cmtApp = await w.getCmtApp(p);
    await checkFocusMode(cmtApp);

    // There is no root `.br-children` in focus mode, get the first cmt-block instead.
    const cmtEl = cmtApp.$('cmt-block');
    await cm.shouldHaveCmtCount({ cmtApp, count: 5 });

    // Check cmt.
    await cm.shouldAppear({
      cmtEl,
      author: usr.user,
      content: 'cmt1',
    });
    await cm.shouldHaveReplyCount({ cmtEl, count: 2, shown: 0 });

    // Click more replies.
    await act.clickRepliesButton({ cmtEl, replyCount: 2 });
    await cm.shouldHaveReplyCount({ cmtEl, count: 2, shown: 2 });

    // Click view all comments.
    await checkViewAllComments(w, p, cmtApp);
  });
}

function test404Cmt(w: cm.CmtFixtureWrapper) {
  w.test('Focus 404 cmt', { viewer: usr.user }, async ({ p }) => {
    const postLink = addCmtParams(`${serverURL}${w.getHostURL(p)}`, '999999');
    await p.gotoRaw(postLink, null);

    const cmtApp = await w.getCmtApp(p);
    await checkFocusMode(cmtApp);

    await check404Content(cmtApp);

    // Click view all comments.
    await checkViewAllComments(w, p, cmtApp);
  });
}

export default function testFocusMode(w: cm.CmtFixtureWrapper) {
  testReply(w);
  testCmt(w);
  test404Cmt(w);
}
