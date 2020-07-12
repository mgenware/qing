import likeTableFactory from './factory/likeTableFactory';
import post from './post';

const hostTables = [post];

export default hostTables.map((hostTable) => ({
  hostTable,
  likeTable: likeTableFactory(hostTable.__name, hostTable.id),
}));
