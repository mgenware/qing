/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { reply as t } from '../../models/cmt/cmt';
import * as cm from '../../models/common';
import user from '../../models/user/user';
import { replyInterface, replyResultType } from './cmtTAUtils';
import { defaultUpdateConditions } from '../common';
import { getEntitySrcType } from '../com/contentBaseTA';

export class ReplyTA extends mm.TableActions {
  selectReplies = mm
    .selectRows(
      t.id.privateAttr(),
      t.content,
      t.created_at,
      t.modified_at,
      t.likes,
      t.user_id.privateAttr(),
      t.to_user_id.privateAttr(),
      t.user_id.join(user).name,
      t.user_id.join(user).icon_name.privateAttr(),
      t.to_user_id.join(user).name,
    )
    .pageMode()
    .by(t.parent_id)
    .orderByDesc(t.created_at)
    .attr(mm.ActionAttribute.groupTypeName, replyInterface)
    .resultTypeNameAttr(replyResultType);
  editReply = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  selectReplySource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType);
  insertReplyCore = mm.insertOne().setDefaults().setInputs();
  deleteReplyCore = mm.deleteOne().whereSQL(defaultUpdateConditions(t));
}

export default mm.tableActions(t, ReplyTA);
