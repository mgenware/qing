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

  getHostID = mm.selectField(t.host_id).byID();

  updateReplyCount = mm
    .updateOne()
    .set(t.rpl_count, mm.sql`${t.rpl_count} + ${mm.int().toInput('offset')}`)
    .where(updateConditions(t));
}

export default mm.tableActions(t, CmtTA);
