/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import ContentBase from '../../models/com/contentBase.js';
import { getSelectCmtsAction } from './cmtTAUtils.js';
import * as cmtf from './cmtTAFactory.js';
import contentBaseUtil from '../../models/com/contentBaseUtil.js';

class ContentBaseCmtVT extends ContentBaseCmt {
  override getHostTable(): ContentBase {
    return contentBaseUtil;
  }
}

const contentBaseCmtVT = mm.table(ContentBaseCmtVT);

export const cmtHostTableParam = 'cmtHostTable';

export class ContentBaseCmtSTA extends mm.TableActions {
  selectRootCmts = getSelectCmtsAction({ rt: contentBaseCmtVT, fetchLikes: false });
  selectRootCmtsWithLikes = getSelectCmtsAction({
    rt: contentBaseCmtVT,
    fetchLikes: true,
  });
  insertCmt = cmtf.insertCmtAction(contentBaseUtil, contentBaseCmtVT);
}

export default mm.tableActions(contentBaseCmtVT, ContentBaseCmtSTA, {
  configurableTableName: cmtHostTableParam,
});
