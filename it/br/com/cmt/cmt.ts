/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { $, User, usr, test } from 'br';
import * as pw from '@playwright/test';
import * as defs from 'base/defs';
import { performUpdateEditor } from 'br/com/editor/editor';
import { getEditBarEditButton } from '../editor/editBar';
import { userViewShouldAppear } from 'br/com/content/userView';
import { performWriteComment } from './util';

export type TestInputType = pw.TestType<
  pw.PlaywrightTestArgs &
    pw.PlaywrightTestOptions & {
      cmtApp: brt.Element;
    },
  pw.PlaywrightWorkerArgs & pw.PlaywrightWorkerOptions
>;

async function commentsHeadingShouldAppear(el: brt.Element) {
  return el.$('h2:has-text("Comments")').shouldBeVisible();
}

function getNthCmt(cmtApp: brt.Element, index: number) {
  return cmtApp.$$('cmt-block').item(index);
}

export interface CheckCmtArgs {
  author: User;
  content: string;
  canEdit: boolean;
  highlighted: boolean;
}

async function cmtShouldAppear(el: brt.Element, e: CheckCmtArgs) {
  // User view.
  const row = el.$('.row');
  await userViewShouldAppear(row, e.author);

  // Comment content.
  await row.$('div.col > div:nth-child(2)').shouldHaveTextContent(e.content);

  const editBtn = getEditBarEditButton(el, e.author.id);
  if (e.canEdit) {
    await editBtn.shouldBeVisible();
  } else {
    await editBtn.shouldNotExist();
  }

  const highlightedCls = 'row highlighted';
  if (e.highlighted) {
    await row.shouldHaveClass(highlightedCls);
  } else {
    await row.shouldNotHaveClass(highlightedCls);
  }
}

export function shouldHaveComments(el: brt.Element, count: number) {
  return el
    .$('.br-cmt-c')
    .shouldHaveTextContent(count === 1 ? '1 comment' : `${count || 'No'} comments`);
}

export interface FixtureStartArg {
  page: brt.Page;
  user: User | null;
}

export abstract class CmtFixture {
  abstract start(arg: FixtureStartArg, cb: () => void): Promise<void>;
  abstract getCmtApp(page: brt.Page): Promise<brt.Element>;
}

class CmtFixtureInternal {
  constructor(public groupName: string, public fixture: CmtFixture) {}

  test(name: string, initialViewer: User | null, cb: (arg: { page: brt.Page }) => Promise<void>) {
    return test(`[${this.groupName}] ${name}`, async ({ page }) => {
      const p = $(page);
      await this.fixture.start({ page: p, user: initialViewer }, () => {
        return cb({ page: p });
      });
    });
  }

  getCmtApp(page: brt.Page) {
    return this.fixture.getCmtApp(page);
  }
}

export function testCmt(groupName: string, fixture: CmtFixture) {
  const h = new CmtFixtureInternal(groupName, fixture);
  h.test('No comments', null, async ({ page }) => {
    {
      // Visitor view.
      const cmtApp = await h.getCmtApp(page);
      await commentsHeadingShouldAppear(cmtApp);
      await shouldHaveComments(cmtApp, 0);

      // "Sign in" to comment.
      await cmtApp.$qingButton('Sign in').shouldBeVisible();
      await cmtApp.$('span:has-text("to comment")').shouldBeVisible();
    }
    {
      // User view.
      page.reload(usr.user);
      const cmtApp = await h.getCmtApp(page);
      await commentsHeadingShouldAppear(cmtApp);
      await shouldHaveComments(cmtApp, 0);
    }
  });

  h.test('Cmt core (no comments, write, view, edit)', usr.user, async ({ page }) => {
    {
      // User view.
      const cmtApp = await h.getCmtApp(page);
      await commentsHeadingShouldAppear(cmtApp);

      // Write a comment.
      await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);
      await cmtShouldAppear(getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.content,
        highlighted: true,
        canEdit: true,
      });
      await shouldHaveComments(cmtApp, 1);

      // Refresh and view the comment.
      await page.reload(null);
      await cmtShouldAppear(getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.content,
        highlighted: false,
        canEdit: true,
      });
      await shouldHaveComments(cmtApp, 1);

      // Edit the comment.
      await getEditBarEditButton(getNthCmt(cmtApp, 0), usr.user.id).click();
      await performUpdateEditor(page, { part: 'content' });
      await cmtShouldAppear(getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.updated,
        highlighted: false,
        canEdit: true,
      });
      await shouldHaveComments(cmtApp, 1);

      // Write another comment.
      await performWriteComment(page, { cmtApp, content: defs.sd.content }, true);
      await cmtShouldAppear(getNthCmt(cmtApp, 0), {
        author: usr.user,
        content: defs.sd.content,
        highlighted: true,
        canEdit: true,
      });
      await shouldHaveComments(cmtApp, 2);
    }
  });
}
