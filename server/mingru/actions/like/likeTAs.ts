import * as mm from 'mingru-models';
import likeTAFactory from './likeTAFactory';
import likeableTables from '../../models/like/likeableTables';

const actions: mm.TableActions[] = [...likeableTables.entries()].map(([hostTable, likeTable]) =>
  likeTAFactory(likeTable, hostTable),
);
export default actions;
