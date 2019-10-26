import * as mm from 'mingru-models';
import t from '../models/userStats';

export class UserStatsTA extends mm.TableActions {
  updatePostCount = mm
    .updateOne()
    .set(t.post_count, mm.sql`${t.post_count} + ${mm.int().toInput('offset')}`)
    .byID();
  incrementPostCount = this.updatePostCount.wrap({ offset: '1' });
  derementPostCount = this.updatePostCount.wrap({ offset: '-1' });
}

export default mm.tableActions(t, UserStatsTA);
