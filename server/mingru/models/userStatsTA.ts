import * as dd from 'mingru-models';
import t from './userStats';

export class UserStatsTA extends dd.TA {
  updatePostCount = dd
    .updateOne()
    .set(t.post_count, dd.sql`${t.post_count} + ${dd.int().toInput('offset')}`)
    .byID();
  incrementPostCount = this.updatePostCount.wrap({ offset: '1' });
  derementPostCount = this.updatePostCount.wrap({ offset: '-1' });
}

export default dd.ta(t, UserStatsTA);
