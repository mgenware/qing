import { newLikeTable, LikeTable, LikeableTable } from './likeTableFactory';
import post from '../post/post';

const hostTables = [post];

const likeableTables = new Map<LikeableTable, LikeTable>(
  hostTables.map((hostTable) => [
    hostTable,
    newLikeTable(hostTable.__getData().name, hostTable.id),
  ]),
);

export default likeableTables;
