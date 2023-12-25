/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as eb from 'cm/editing/editBar.js';
import * as alt from 'cm/overlays/alert.js';
import * as def from '@qing/dev/it/base/def.js';
import * as cm from '../common.js';
import { writeCmt } from '../actions.js';
import { CmtFixture } from '../fixture.js';
import { Page } from '@playwright/test';

export function testDeleteCmt(w: CmtFixture, page: Page, fresh: boolean) {
  return w.start(page, { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await writeCmt(p, { cmtApp, content: def.sd.content });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
        }

        // Delete the comment.
        await eb.getDeleteButton(cm.getNthCmt({ cmtApp, index: 0 }), usr.user.id).click();
        const dialog = await alt.wait(p, {
          title: 'Do you want to delete this comment?',
          focusedBtn: 1,
        });
        await dialog.clickYes();
        await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
      }
      {
        // Visitor.
        await p.reloadWithUser(null);
        const cmtApp = await w.getCmtApp(p);
        await cm.shouldHaveCmtCount({ cmtApp, count: 0 });
      }
    }
  });
}
