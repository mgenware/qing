import * as mm from 'mingru-models';
import {
  LikeTable,
  LikeableTable,
} from '../../models/factory/likeTableFactory';
import { TableActions } from 'mingru-models';

function updateLikesAction(
  hostTable: LikeableTable,
  offset: number,
): mm.UpdateAction {
  return mm
    .updateOne()
    .from(hostTable)
    .set(hostTable.likes, mm.sql`${hostTable.likes} + ${offset.toString()}`)
    .byID('hostID');
}

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
      updateLikesAction(hostTable, -1),
    ),
    like: mm.transact(
      mm.insertOne().setInputs(),
      updateLikesAction(hostTable, 1),
    ),
  };
  return mm.tableActionsCore(table, null, actions);
}
