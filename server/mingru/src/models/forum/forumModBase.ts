import * as mm from 'mingru-models';

export default interface ForumModBase extends mm.Table {
  object_id: mm.Column;
  user_id: mm.Column;
}
