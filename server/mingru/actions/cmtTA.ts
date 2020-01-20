import * as mm from 'mingru-models';
import t from '../models/cmt';
import * as cm from '../models/common';

const updateConditions = mm.and(
  mm.sql`${t.id.isEqualToInput()}`,
  mm.sql`${t.user_id.isEqualToInput()}`,
);

export class CmtTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .where(updateConditions);

  selectCmtForEditing = mm.select(t.content).where(updateConditions);

  deleteCmt = mm.deleteOne().where(updateConditions);
}

export default mm.tableActions(t, CmtTA);
