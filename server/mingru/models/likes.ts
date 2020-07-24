import {
  newLikeTable,
  LikeTable,
  LikeableTable,
} from './factory/likeTableFactory';
import post from './post';

const hostTables = [post];

const map = new Map<LikeableTable, LikeTable>(
  hostTables.map((hostTable) => [
    hostTable,
    newLikeTable(hostTable.__name, hostTable.id),
  ]),
);

export default map;
