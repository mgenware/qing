import * as mm from 'mingru-models';
import {
  LikeTable,
  LikeableTable,
} from '../../models/factory/likeTableFactory';
import { TableActions } from 'mingru-models';

export default function getLikeTableActions(
  table: LikeTable,
  hostTable: LikeableTable,
): TableActions {
  const actions = {
    cancelLike: mm.transact(
      mm
        .deleteOne()
        .where(
          mm.and(
            table.host_id.isEqualToInput(),
            table.user_id.isEqualToInput(),
          ),
        ),
      mm
        .updateOne()
        .from(hostTable)
        .set(hostTable.likes, mm.sql`${hostTable.likes} + 1`)
        .byID('postID'),
    ),
  };
  return mm.tableActionsCore(table, null, actions);
}
