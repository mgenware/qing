import * as mm from 'mingru-models';
import { UpdateAction } from 'mingru-models';
import t from '../../models/user/userStats';

export const offsetParamName = 'offset';

function updateCounterAction(column: mm.Column): UpdateAction {
  return mm
    .updateOne()
    .set(column, mm.sql`${column} + ${mm.int().toInput(offsetParamName)}`)
    .by(t.id, 'userID');
}

export class UserStatsTA extends mm.TableActions {
  selectStats = mm.select(t.post_count).by(t.id);

  updatePostCount = updateCounterAction(t.post_count);
  updateFormPostCount = updateCounterAction(t.form_post_count);
}

export default mm.tableActions(t, UserStatsTA);
