import * as mm from 'mingru-models';
import { TableWithID } from '../common';
import user from '../user/user';

export interface LikeTable extends mm.Table {
  user_id: mm.Column;
  host_id: mm.Column;
}

export interface LikeableTable extends TableWithID {
  likes: mm.Column;
}

export function newLikeTable(hostName: string, hostIDColumn: mm.Column): LikeTable {
  const className = `${hostName}_like`;
  const cols = {
    user_id: mm.pk(user.id),
    host_id: mm.pk(hostIDColumn),
  };
  return mm.tableCore(className, null, null, cols) as LikeTable;
}
