/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { usr } from 'br.js';
import * as def from 'base/def.js';
import * as cm from '../common.js';
import { writeCmt, editCmt } from '../actions.js';
import * as cps from 'br/cm/editing/composer.js';
import delay from 'base/delay.js';

function testEditCore(w: cm.CmtFixtureWrapper, fresh: boolean) {
  w.test(`Edit a cmt - ${fresh ? 'Fresh' : 'Not fresh'}`, { viewer: usr.user }, async ({ p }) => {
    {
      {
        let cmtApp = await w.getCmtApp(p);
        await writeCmt(p, { cmtApp, content: def.sd.content });
        let cmtEl = cm.getTopCmt({ cmtApp });

        if (!fresh) {
          await p.reload();
          cmtApp = await w.getCmtApp(p);
          cmtEl = cm.getTopCmt({ cmtApp });
        }

        // Edit the comment.
        await editCmt(p, {
          cmtEl,
          content: def.sd.updated,
          author: usr.user,
          shownCb: async (overlayEl) => {
            await cps.shouldAppear(overlayEl, {
              name: 'Edit comment',
              title: null,
              contentHTML: def.sd.contentViewHTML,
            });
          },
        });
        await delay();
        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          highlighted: fresh,
          canEdit: true,
          hasEdited: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
      {
        // Visitor.
        await p.reload(null);
        const cmtApp = await w.getCmtApp(p);

        await cm.shouldAppear({
          cmtEl: cm.getNthCmt({ cmtApp, index: 0 }),
          author: usr.user,
          content: def.sd.updated,
          hasEdited: true,
        });
        await cm.shouldHaveCmtCount({ cmtApp, count: 1 });
      }
    }
  });
}

export default function testEdit(w: cm.CmtFixtureWrapper) {
  testEditCore(w, true);
  testEditCore(w, false);
}
