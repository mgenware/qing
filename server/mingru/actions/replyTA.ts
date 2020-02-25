import * as mm from 'mingru-models';
import { reply as t } from '../models/cmt';
import * as cm from '../models/common';
import { updateConditions } from './cmtTAUtils';

export class ReplyTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .where(updateConditions(t));
  selectCmtSource = mm.select(t.content).where(updateConditions(t));
  deleteCmt = mm.deleteOne().where(updateConditions(t));
}

export default mm.tableActions(t, ReplyTA);
