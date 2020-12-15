import * as mm from 'mingru-models';
import PermBase from '../../models/com/permBase';

export function createPermBaseTA(t: PermBase): mm.TableActions {
  const actions = {
    hasPerm: mm
      .selectExists()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
    addPerm: mm.insertOne().setInputs(t.object_id, t.user_id),
    removeMod: mm
      .deleteOne()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
  };
  return mm.tableActionsCore(t, null, actions, undefined);
}
