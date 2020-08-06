import * as mm from 'mingru-models';
import { reply as t } from '../models/cmt';
import * as cm from '../models/common';
import user from '../models/user';
import {
  updateConditions,
  replyInterface,
  replyResultType,
} from './cmtTAUtils';

export class ReplyTA extends mm.TableActions {
  selectReplies = mm
    .selectPage(
      t.id.privateAttr(),
      t.content,
      t.created_at,
      t.modified_at,
      t.user_id.privateAttr(),
      t.to_user_id.privateAttr(),
      t.user_id.join(user).name,
      t.user_id.join(user).icon_name.privateAttr(),
      t.to_user_id.join(user).name,
    )
    .from(t)
    .by(t.parent_id)
    .orderByDesc(t.created_at)
    .attrs({
      [mm.ActionAttributes.groupTypeName]: replyInterface,
      [mm.ActionAttributes.resultTypeName]: replyResultType,
    });
  getParentID = mm.selectField(t.parent_id).byID();
  editReply = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(updateConditions(t));
  selectReplySource = mm.select(t.content).whereSQL(updateConditions(t));
}

export default mm.tableActions(t, ReplyTA);
