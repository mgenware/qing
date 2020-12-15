import * as mm from 'mingru-models';
import ForumModBase from '../../models/forum/forumModBase';

export function createForumModTA(t: ForumModBase): mm.TableActions {
  const actions = {
    isMod: mm
      .selectExists()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
    addMod: mm.insertOne().setInputs(t.object_id, t.user_id),
    removeMod: mm
      .deleteOne()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
  };
  return mm.tableActionsCore(t, null, actions, undefined);
}
