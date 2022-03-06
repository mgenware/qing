/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { getSelectCmtsAction } from './cmtTAUtils.js';
import * as cmtf from './cmtTAFactory.js';
import contentBaseCmtUtil from '../../models/com/contentBaseCmtUtil.js';

export const cmtRelationTable = 'cmtRelationTable';

export class ContentBaseCmtUtilTA extends mm.TableActions {
  selectRootCmts = getSelectCmtsAction({ rt: contentBaseCmtUtil, fetchLikes: false });
  selectRootCmtsWithLikes = getSelectCmtsAction({
    rt: contentBaseCmtUtil,
    fetchLikes: true,
  });
  insertCmt = cmtf.insertCmtAction(contentBaseCmtUtil);
  insertReply = cmtf.insertReplyAction();
}

export default mm.tableActions(contentBaseCmtUtil, ContentBaseCmtUtilTA, {
  configurableTableName: cmtRelationTable,
});
