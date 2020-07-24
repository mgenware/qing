import * as mm from 'mingru-models';
import likeTAFactory from './factory/likeTAFactory';
import likeMap from '../models/likes';

const actions: mm.TableActions[] = [
  ...likeMap.entries(),
].map(([hostTable, likeTable]) => likeTAFactory(likeTable, hostTable));
export default actions;
