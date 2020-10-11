import * as mm from 'mingru-models';
import { UpdateAction } from 'mingru-models';
import t from '../models/userStats';

export const offsetParamName = 'offset';

function updateCounterAction(column: mm.Column): UpdateAction {
  return mm
    .updateOne()
    .set(column, mm.sql`${column} + ${mm.int().toInput(offsetParamName)}`)
    .byID('userID');
}

export class UserStatsTA extends mm.TableActions {
  selectStats = mm.select(t.post_count).byID();

  updatePostCount = updateCounterAction(t.post_count);
}

export default mm.tableActions(t, UserStatsTA);
