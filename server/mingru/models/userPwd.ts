import * as mm from 'mingru-models';

export class UserPwd extends mm.Table {
  // `id` is from `user.id`.
  id = mm.pk().noAutoIncrement;
  pwd_hash = mm.varChar(255);
}

export default mm.table(UserPwd);
