import * as mm from 'mingru-models';

export class UserPwd extends mm.Table {
  id = mm.pk();
  pwd_hash = mm.varChar(255);
}

export default mm.table(UserPwd);
