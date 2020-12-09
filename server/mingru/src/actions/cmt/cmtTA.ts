import * as mm from 'mingru-models';
import { cmt as t } from '../../models/cmt/cmt';
import * as cm from '../../models/common';
import { defaultUpdateConditions } from '../common';

export class CmtTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  selectCmtSource = mm.select(t.content).whereSQL(defaultUpdateConditions(t));

  getHostIDAndReplyCount = mm.select(t.host_id, t.reply_count).by(t.id);

  updateReplyCount = mm
    .updateOne()
    .set(t.reply_count, mm.sql`${t.reply_count} + ${mm.int().toInput('offset')}`)
    .whereSQL(defaultUpdateConditions(t));
}

export default mm.tableActions(t, CmtTA);
