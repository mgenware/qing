import * as dd from 'dd-models';

export class UserStats extends dd.Table {
  id = dd.pk().noAutoIncrement;
  post_count = dd.uInt(0);
}

export default dd.table(UserStats);
