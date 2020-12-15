import * as mm from 'mingru-models';
import { maxPwdHashLen } from '../../constants.json';

export class UserPwd extends mm.Table {
  // `id` is from `user.id`.
  id = mm.pk().noAutoIncrement;
  pwd_hash = mm.varChar(maxPwdHashLen);
}

export default mm.table(UserPwd);
