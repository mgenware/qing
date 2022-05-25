/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as def from 'base/def';
import * as cm from './common';
import * as act from './actions';
import { editorShouldAppear } from 'br/com/editor/editor';

function testCreateCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test(
    `Create and view a ${fresh ? 'fresh ' : ''}cmt, default ordering`,
    usr.user,
    async ({ page }) => {
      {
        {
          // User 1.
          let cmtApp = await w.getCmtApp(page);
          await act.writeCmt(page, {
            cmtApp,
            content: def.sd.content,
            shownCb: async () => {
              await editorShouldAppear(page, {
                name: 'Write a comment',
                title: null,
                contentHTML: '',
                buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
              });
            },
          });

          if (!fresh) {
            await page.reload();
            cmtApp = await w.getCmtApp(page);
          }

          await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
            author: usr.user,
            content: def.sd.content,
            highlighted: fresh,
            canEdit: true,
          });
          await cm.shouldHaveCmtCount(cmtApp, 1);
        }
        {
          // Visitor.
          await page.reload(null);
          const cmtApp = await w.getCmtApp(page);

          await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
            author: usr.user,
            content: def.sd.content,
          });
          await cm.shouldHaveCmtCount(cmtApp, 1);
        }
      }
    },
  );
}

function testCreateCmtsPagination(w: CmtFixtureWrapper) {
  w.test('Create cmts, pagination', usr.user, async ({ page }) => {
    {
      const total = 5;
      {
        // User 1.
        const cmtApp = await w.getCmtApp(page);
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(page, { cmtApp, content: `${i + 1}`, dbTimeChange: true });
        }
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, i), {
            author: usr.user,
            content: `${total - i}`,
            highlighted: true,
            canEdit: true,
          });
        }
        await cm.shouldHaveCmtCount(cmtApp, total);
        await cm.shouldHaveShownRootCmtCount(cmtApp, total);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.shouldHaveCmtCount(cmtApp, total);
        // Only 2 are shown by default.
        await cm.shouldHaveShownRootCmtCount(cmtApp, 2);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: '5',
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
          author: usr.user,
          content: '4',
        });

        // Show more.
        await act.clickMoreCmts(cmtApp);
        await cm.shouldHaveShownRootCmtCount(cmtApp, 4);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 2), {
          author: usr.user,
          content: '3',
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 3), {
          author: usr.user,
          content: '2',
        });

        // Show more.
        await act.clickMoreCmts(cmtApp);
        await cm.shouldHaveShownRootCmtCount(cmtApp, 5);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 4), {
          author: usr.user,
          content: '1',
        });

        // Total cmt count should not change after loading.
        await cm.shouldHaveCmtCount(cmtApp, total);
      }
    }
  });
}

// Forked from `testCreateCmtsPagination`.
// Tests creating cmts while loading more pages. Duplicates should not happen.
function testCreateCmtsDedup(w: CmtFixtureWrapper) {
  w.test('Create cmts, dedup', usr.user, async ({ page }) => {
    {
      const total = 5;
      {
        // Setup predefined cmts.
        const cmtApp = await w.getCmtApp(page);
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(page, { cmtApp, content: `${i + 1}`, dbTimeChange: true });
        }
        await cm.shouldHaveCmtCount(cmtApp, total);
        await cm.shouldHaveShownRootCmtCount(cmtApp, total);
      }
      {
        await page.reload();
        const cmtApp = await w.getCmtApp(page);

        // Create a cmt with "more cmts" never clicked.
        await act.writeCmt(page, { cmtApp, content: 'new 1' });

        await cm.shouldHaveCmtCount(cmtApp, total + 1);
        // 3 cmts are shown.
        await cm.shouldHaveShownRootCmtCount(cmtApp, 3);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
          author: usr.user,
          content: '5',
          canEdit: true,
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 2), {
          author: usr.user,
          content: '4',
          canEdit: true,
        });

        // Show more.
        await act.clickMoreCmts(cmtApp);
        await cm.shouldHaveCmtCount(cmtApp, total + 1);
        await cm.shouldHaveShownRootCmtCount(cmtApp, 5);

        // Create 2 cmts with "more cmts" clicked but not fully loaded.
        await act.writeCmt(page, { cmtApp, content: 'new 2' });
        await act.writeCmt(page, { cmtApp, content: 'new 3' });

        await cm.shouldHaveCmtCount(cmtApp, total + 3);
        await cm.shouldHaveShownRootCmtCount(cmtApp, 7);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: 'new 3',
          highlighted: true,
          canEdit: true,
        });

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
          author: usr.user,
          content: 'new 2',
          highlighted: true,
          canEdit: true,
        });

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 2), {
          author: usr.user,
          content: 'new 1',
          highlighted: true,
          canEdit: true,
        });

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 3), {
          author: usr.user,
          content: '5',
          canEdit: true,
        });

        // Item 4, 3 are skipped.
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 6), {
          author: usr.user,
          content: '2',
          canEdit: true,
        });

        // Show more.
        // Pull the last 1 cmt.
        await act.clickMoreCmts(cmtApp);
        await cm.shouldHaveCmtCount(cmtApp, total + 3);
        await cm.shouldHaveShownRootCmtCount(cmtApp, 8);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 7), {
          author: usr.user,
          content: '1',
          canEdit: true,
        });
      }
    }
  });
}

export default function testCreateCmt(w: CmtFixtureWrapper) {
  testCreateCmtCore(w, true);
  testCreateCmtCore(w, false);
  testCreateCmtsPagination(w);
  testCreateCmtsDedup(w);
}
