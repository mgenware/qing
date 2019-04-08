import * as dd from 'dd-models';
import t from './post';

const ta = dd.actions(t);
ta.insertOneWithDefaults('Post').setInputs(t.title, t.content, t.user_id);

export default ta;
