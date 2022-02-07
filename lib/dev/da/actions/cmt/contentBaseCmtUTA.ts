/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import ContentBase from '../../models/com/contentBase.js';
import { getSelectCmtsAction } from '../cmt/cmtTAUtils.js';
import * as cmtf from '../cmt/cmtTAFactory.js';
import { contentBaseUTA, contentBaseTableParam } from '../com/contentBaseUTA.js';

class ContentBaseUtil extends ContentBase {}

const contentBaseUtil = mm.table(ContentBaseUtil);

class ContentBaseCmtUtil extends ContentBaseCmt {
  override getHostTable(): ContentBase {
    return contentBaseUtil;
  }
}

const contentBaseCmtUtil = mm.table(ContentBaseCmtUtil);

export const cmtHostTableParam = 'cmtHostTable';

export class ContentBaseCmtUTA extends mm.TableActions {
  selectRootCmts = getSelectCmtsAction({ rt: contentBaseCmtUtil, fetchLikes: false });
  selectRootCmtsWithLikes = getSelectCmtsAction({
    rt: contentBaseCmtUtil,
    fetchLikes: true,
  });
  insertCmt = cmtf.insertCmtAction(
    contentBaseCmtUtil,
    contentBaseUTA.incrementCmtCount.wrap({
      [contentBaseTableParam]: mm.valueRef(cmtHostTableParam),
    }),
  );
}

export default mm.tableActions(contentBaseCmtUtil, ContentBaseCmtUTA, {
  configurableTableName: cmtHostTableParam,
});
