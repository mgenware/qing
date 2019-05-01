import * as dd from 'dd-models';
import userStats from './userStats';

const ta = dd.actions(userStats);
ta.updateOne('PostCount')
  .set(
    userStats.post_count,
    dd.sql`${userStats.post_count} + ${dd.int().toInput('offset')}`,
  )
  .byID();

export default ta;
