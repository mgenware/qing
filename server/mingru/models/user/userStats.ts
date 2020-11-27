import * as mm from 'mingru-models';

function createCounterColumn(): mm.Column {
  return mm.uInt().default(0);
}

export class UserStats extends mm.Table {
  // `id` is from `user.id`.
  id = mm.pk().noAutoIncrement;

  // Stats.
  post_count = createCounterColumn();
  discussion_count = createCounterColumn();
}

export default mm.table(UserStats);
