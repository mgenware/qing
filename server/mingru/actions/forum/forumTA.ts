import * as mm from 'mingru-models';
import t from '../../models/forum/forum';

export class ForumTA extends mm.TableActions {
  selectForum = mm.select(t.created_at, t.desc, t.display_name);
}

export default mm.tableActions(t, ForumTA);
