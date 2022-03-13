/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { getSelectCmtsAction } from './cmtAGUtils.js';
import * as cmtf from './cmtAGFactory.js';
import contentBaseCmtUtil from '../../models/com/contentBaseCmtUtil.js';

export const cmtRelationTable = 'cmtRelationTable';

export class ContentBaseCmtUtilAG extends mm.ActionGroup {
  selectRootCmts = getSelectCmtsAction({ rt: contentBaseCmtUtil, fetchLikes: false });
  selectRootCmtsWithLikes = getSelectCmtsAction({
    rt: contentBaseCmtUtil,
    fetchLikes: true,
  });
  insertCmt = cmtf.insertCmtAction(contentBaseCmtUtil);
  insertReply = cmtf.insertReplyAction();
}

export default mm.actionGroup(contentBaseCmtUtil, ContentBaseCmtUtilAG, {
  configurableTableName: cmtRelationTable,
});
