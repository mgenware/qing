import * as mm from 'mingru-models';

export class UserStats extends mm.Table {
  id = mm.pk().noAutoIncrement;
  post_count = mm.uInt(0);
}

export default mm.table(UserStats);
