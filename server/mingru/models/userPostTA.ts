import * as dd from 'dd-models';
import t from './userPost';

const ta = dd.actions(t);
ta.insertOne('UserPost').setInputs(t.title, t.content);

export default ta;
