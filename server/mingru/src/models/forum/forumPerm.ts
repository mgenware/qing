import * as mm from 'mingru-models';
import PermBase from '../com/permBase';
import user from '../user/user';
import forum from './forum';

export class ForumPerm extends mm.Table implements PermBase {
  object_id = mm.pk(forum.id);
  user_id = mm.pk(user.id);
}

export default mm.table(ForumPerm);
