import * as mm from 'mingru-models';
import t from '../../models/forum/forumGroup';

export class ForumGroupTA extends mm.TableActions {
  selectGroup = mm
    .select(t.id, t.name, t.desc, t.created_at, t.desc_modified_at, t.forum_count)
    .by(t.id);
  deleteGroup = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).setDefaults(t.desc_modified_at).by(t.id);
  insertGroup = mm.insertOne().setInputs(t.name, t.desc).setDefaults();
}

export default mm.tableActions(t, ForumGroupTA);
