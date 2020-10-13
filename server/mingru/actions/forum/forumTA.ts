import * as mm from 'mingru-models';
import t from '../../models/forum/forum';
import forumGroup from '../../models/forum/forumGroup';

const coreColumns = [t.created_at, t.desc, t.display_name];

export class ForumTA extends mm.TableActions {
  selectForum = mm.select(...coreColumns);

  selectForums = mm.selectRows(...coreColumns).where`${forumGroup.id.isEqualToInput()}`.orderByAsc(
    t.display_name,
  );
}

export default mm.tableActions(t, ForumTA);
