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
import { contentBaseSTA, contentBaseTableParam } from '../com/contentBaseSTA.js';

class ContentBaseVT extends ContentBase {}

const contentBaseVT = mm.table(ContentBaseVT);

class ContentBaseCmtUtil extends ContentBaseCmt {
  override getHostTable(): ContentBase {
    return contentBaseVT;
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
    contentBaseSTA.incrementCmtCount.wrap({
      [contentBaseTableParam]: mm.valueRef(cmtHostTableParam),
    }),
  );
}

export default mm.tableActions(contentBaseCmtUtil, ContentBaseCmtUTA, {
  configurableTableName: cmtHostTableParam,
});
