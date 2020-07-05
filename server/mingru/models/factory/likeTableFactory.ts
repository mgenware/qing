import * as mm from 'mingru-models';
import user from '../user';

export interface LikeTable extends mm.Table {
  user_id: mm.Column;
  host_id: mm.Column;
}

export default function newLikeTable(
  hostName: string,
  hostIDColumn: mm.Column,
): LikeTable {
  const className = `${hostName}_like`;
  const cols: [string, mm.Column][] = [
    ['user_id', user.id],
    ['host_id', hostIDColumn],
  ];
  return mm.tableCore(className, null, null, cols) as LikeTable;
}
