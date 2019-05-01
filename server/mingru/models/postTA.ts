import * as dd from 'dd-models';
import t from './post';

const ta = dd.actions(t);
ta.selectAll(
  'PostsByUser',
  t.id,
  t.title,
  t.content,
  t.created_at,
  t.modified_at,
)
  .paginate()
  .where(t.user_id.isEqualToInput());

ta.insertOneWithDefaults('Post').setInputs(t.title, t.content, t.user_id);

export default ta;
