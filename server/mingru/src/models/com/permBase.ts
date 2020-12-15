import * as mm from 'mingru-models';

export default interface PermBase extends mm.Table {
  object_id: mm.Column;
  user_id: mm.Column;
}
