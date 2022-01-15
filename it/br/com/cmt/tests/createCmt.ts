/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CmtFixtureWrapper } from './common';
import { usr } from 'br';
import * as defs from 'base/defs';
import * as cm from './common';
import { writeCmt, clickMoreCmt } from './actions';

function testCreateCmtCore(w: CmtFixtureWrapper, fresh: boolean) {
  w.test('Create a cmt' + (fresh ? ' (fresh)' : ''), usr.user, async ({ page }) => {
    {
      {
        // User 1.
        let cmtApp = await w.getCmtApp(page);
        await writeCmt(page, { cmtApp, content: defs.sd.content, checkVisuals: true });

        if (!fresh) {
          await page.reload();
          cmtApp = await w.getCmtApp(page);
        }

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.content,
          highlighted: fresh,
          canEdit: true,
        });
        await cm.shouldHaveComments(cmtApp, 1);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: defs.sd.content,
        });
        await cm.shouldHaveComments(cmtApp, 1);
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
          await writeCmt(page, { cmtApp, content: `${i + 1}` });
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
        await cm.shouldHaveComments(cmtApp, total);
      }
      {
        // Visitor.
        await page.reload(null);
        const cmtApp = await w.getCmtApp(page);

        await cm.shouldHaveComments(cmtApp, 3);
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 0), {
          author: usr.user,
          content: '3',
        });
        await cm.cmtShouldAppear(cm.getNthCmt(cmtApp, 1), {
          author: usr.user,
          content: '2',
        });
        await clickMoreCmt(cmtApp);

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
