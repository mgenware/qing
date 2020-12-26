import * as mm from 'mingru-models';
import t from '../../models/forum/forumIsUserMod';

export class ForumIsUserModTA extends mm.TableActions {
  has = mm.selectExists().whereSQL(t.id.isEqualToInput());
}

export default mm.tableActions(t, ForumIsUserModTA);
