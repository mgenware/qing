/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { getSelectCmtsAction } from './cmtAGUtils.js';
import * as cmtf from './cmtAGFactory.js';
import contentBaseCmtTableParam from '../../models/com/contentBaseCmtTableParam.js';

export const cmtRelationTable = 'cmtRelationTable';

export class ContentBaseCmtStaticAG extends mm.ActionGroup {
  selectRootCmts = getSelectCmtsAction({ rt: contentBaseCmtTableParam, fetchLikes: false });
  selectRootCmtsWithLikes = getSelectCmtsAction({
    rt: contentBaseCmtTableParam,
    fetchLikes: true,
  });
  insertCmt = cmtf.insertCmtAction(contentBaseCmtTableParam);
  insertReply = cmtf.insertReplyAction();
}

export default mm.actionGroup(contentBaseCmtTableParam, ContentBaseCmtStaticAG);
