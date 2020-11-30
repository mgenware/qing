import * as mm from 'mingru-models';
import t from '../../models/forum/forum';

export class ForumTA extends mm.TableActions {
  selectItem = mm
    .select(t.id, t.name, t.desc, t.created_at, t.desc_modified_at, t.thread_count)
    .by(t.id);
  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).setDefaults(t.desc_modified_at).by(t.id);
  insertItem = mm.insertOne().setInputs(t.name, t.desc).setDefaults();
}

export default mm.tableActions(t, ForumTA);
