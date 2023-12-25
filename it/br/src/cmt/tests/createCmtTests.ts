/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cm from '../common.js';
import * as act from '../actions.js';
import * as cps from 'cm/editing/composer.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testCreateCmts(fixture: CmtFixture, page: Page, fresh: boolean) {
  return fixture.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      {
        // User 1.
        let cmtApp = await fixture.getCmtApp(p);
        await act.writeCmt(p, {
          cmtApp,
          content: def.sd.content,
          shownCb: async (overlayEl) => {
            await cps.shouldAppear(overlayEl, {
              name: 'Write a comment',
              title: null,
              contentHTML: '',
            });
          },
        });

        if (!fresh) {
          await p.reload();
          cmtApp = await fixture.getCmtApp(p);
        }

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.content,
          highlighted: fresh,
          canEdit: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
        const cmtApp = await fixture.getCmtApp(p);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.content,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
    }
  });
}

export function testCreateCmtsWithPagination(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      const total = 5;
      {
        // User 1.
        const cmtApp = await w.getCmtApp(p);
        const datePrefix = '2006-12-';
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(p, {
            cmtApp,
            content: `${i + 1}`,
            date: new Date(`${datePrefix}${i + 1}`),
          });
        }
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await cm.shouldAppear({
            cmtEl: cm.getNthCmt({ cmtApp, index: i }),
            author: usr.user,
            content: `${total - i}`,
            highlighted: true,
            canEdit: true,
          });
        }
        await cm.shouldHaveCmtCount({ cmtApp, count: total });
        await cm.shouldHaveShownRootCmtCount(cmtApp, total);
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
        const cmtApp = await w.getCmtApp(p);

        await cm.shouldHaveCmtCount({ cmtApp, count: total });
        // Only 2 are shown by default.
        await cm.shouldHaveShownRootCmtCount(cmtApp, 2);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: '5',
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 1 }),
          author: usr.user,
          content: '4',
        });

        // Show more.
        await act.clickMoreCmts({ cmtApp });
        await cm.shouldHaveShownRootCmtCount(cmtApp, 4);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 2 }),
          author: usr.user,
          content: '3',
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 3 }),
          author: usr.user,
          content: '2',
        });

        // Show more.
        await act.clickMoreCmts({ cmtApp });
        await cm.shouldHaveShownRootCmtCount(cmtApp, 5);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 4 }),
          author: usr.user,
          content: '1',
        });

        // Total cmt count should not change after loading.
        await cm.shouldHaveCmtCount({ cmtApp, count: total });
      }
    }
  });
}

// Forked from `testCreateCmtsPagination`.
// Tests creating cmts while loading more pages. Duplicates should not happen.
export function testCreateCmtsWithDedup(w: CmtFixture, page: Page) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      const total = 5;
      {
        // Setup predefined cmts.
        const cmtApp = await w.getCmtApp(p);
        const datePrefix = '2006-12-';
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(p, {
            cmtApp,
            content: `${i + 1}`,
            date: new Date(`${datePrefix}${i + 1}`),
          });
        }
        await cm.shouldHaveCmtCount({ cmtApp, count: total });
        await cm.shouldHaveShownRootCmtCount(cmtApp, total);
      }
      {
        await p.reload();
        const cmtApp = await w.getCmtApp(p);

        // Create a cmt with "more cmts" never clicked.
        await act.writeCmt(p, { cmtApp, content: 'new 1' });

        await cm.shouldHaveCmtCount({ cmtApp, count: total + 1 });
        // 3 cmts are shown.
        await cm.shouldHaveShownRootCmtCount(cmtApp, 3);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 1 }),
          author: usr.user,
          content: '5',
          canEdit: true,
        });
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 2 }),
          author: usr.user,
          content: '4',
          canEdit: true,
        });

        // Show more.
        await act.clickMoreCmts({ cmtApp });
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 1 });
        await cm.shouldHaveShownRootCmtCount(cmtApp, 5);

        // Create 2 cmts with "more cmts" clicked but not fully loaded.
        await act.writeCmt(p, { cmtApp, content: 'new 2' });
        await act.writeCmt(p, { cmtApp, content: 'new 3' });

        await cm.shouldHaveCmtCount({ cmtApp, count: total + 3 });
        await cm.shouldHaveShownRootCmtCount(cmtApp, 7);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: 'new 3',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 1 }),
          author: usr.user,
          content: 'new 2',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 2 }),
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 3 }),
          author: usr.user,
          content: '5',
          canEdit: true,
        });

        // Item 4, 3 are skipped.
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 6 }),
          author: usr.user,
          content: '2',
          canEdit: true,
        });

        // Show more.
        // Pull the last 1 cmt.
        await act.clickMoreCmts({ cmtApp });
        await cm.shouldHaveCmtCount({ cmtApp, count: total + 3 });
        await cm.shouldHaveShownRootCmtCount(cmtApp, 8);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 7 }),
          author: usr.user,
          content: '1',
          canEdit: true,
        });
      }
    }
  });
}
