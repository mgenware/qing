import * as mm from 'mingru-models';
import {
  LikeTable,
  LikeableTable,
} from '../../models/factory/likeTableFactory';

const likeInterface = 'LikeInterface';

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
): mm.TableActions {
  const actions = {
    cancelLike: mm
      .transact(
        mm
          .deleteOne()
          .where(
            mm.and(
              table.host_id.isEqualToInput(),
              table.user_id.isEqualToInput(),
            ),
          ),
        updateLikesAction(hostTable, -1),
      )
      .attr(mm.ActionAttributes.groupTypeName, likeInterface),
    like: mm
      .transact(
        mm.insertOne().setInputs(table.host_id, table.user_id),
        updateLikesAction(hostTable, 1),
      )
      .attr(mm.ActionAttributes.groupTypeName, likeInterface),
    hasLiked: mm
      .selectExists()
      .where(
        mm.and(table.host_id.isEqualToInput(), table.user_id.isEqualToInput()),
      )
      .attr(mm.ActionAttributes.groupTypeName, likeInterface),
  };
  return mm.tableActionsCore(table, null, actions);
}
