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
  w.test(`Create and view a ${fresh ? 'fresh ' : ''}cmt`, usr.user, async ({ page }) => {
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
  });
}

function testCreateCmtsAndPagination(w: CmtFixtureWrapper) {
  w.test('Create cmts, pagination', usr.user, async ({ page }) => {
    {
      {
        // User 1.
        const cmtApp = await w.getCmtApp(page);
        const total = 3;
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await act.writeCmt(page, { cmtApp, content: `${i + 1}`, waitForTimeChange: true });
        }
        for (let i = 0; i < total; i++) {
          // eslint-disable-next-line no-await-in-loop
          await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, i), {
            author: usr.user,
            content: `${3 - i}`,
            highlighted: true,
            canEdit: true,
          });
        }
        await cm.shouldHaveCmtCount(cmtApp, total);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.shouldHaveCmtCount(cmtApp, 3);
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: '3',
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
          author: usr.user,
          content: '2',
        });
        await act.clickMoreCmt(cmtApp);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 2), {
          author: usr.user,
          content: '1',
        });
      }
    }
  });
}

export default function testCreateCmt(w: CmtFixtureWrapper) {
  testCreateCmtCore(w, true);
  testCreateCmtCore(w, false);
  testCreateCmtsAndPagination(w);
}
