import * as mm from 'mingru-models';
import likeTAFactory from './factory/likeTAFactory';
import likeTables from '../models/likes';

const actions: mm.TableActions[] = likeTables.map((t) =>
  likeTAFactory(t.likeTable, t.hostTable),
);
export default actions;
