import * as mm from 'mingru-models';
import { cmt as t } from '../models/cmt';
import * as cm from '../models/common';
import { updateConditions } from './cmtTAUtils';

export class CmtTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .where(updateConditions(t));
  selectCmtSource = mm.select(t.content).where(updateConditions(t));

  getHostIDAndReplyCount = mm.select(t.host_id, t.reply_count).byID();

  updateReplyCount = mm
    .updateOne()
    .set(
      t.reply_count,
      mm.sql`${t.reply_count} + ${mm.int().toInput('offset')}`,
    )
    .where(updateConditions(t));
}

export default mm.tableActions(t, CmtTA);
