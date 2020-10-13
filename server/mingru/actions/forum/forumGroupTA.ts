import * as mm from 'mingru-models';
import t from '../../models/forum/forumGroup';

export class ForumGroupTA extends mm.TableActions {
  selectForumGroup = mm.select(t.created_at, t.desc, t.display_name);
  selectForumGroups = mm.selectRows(t.created_at, t.display_name).orderByAsc(t.display_name);
}

export default mm.tableActions(t, ForumGroupTA);
