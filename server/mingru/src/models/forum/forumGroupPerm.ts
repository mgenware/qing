import * as mm from 'mingru-models';
import PermBase from '../com/permBase';
import user from '../user/user';
import forumGroup from './forumGroup';

export class ForumGroupPerm extends mm.Table implements PermBase {
  object_id = mm.pk(forumGroup.id);
  user_id = mm.pk(user.id);
}

export default mm.table(ForumGroupPerm);
