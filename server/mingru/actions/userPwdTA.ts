import * as mm from 'mingru-models';
import t from '../models/userPwd';

export class UserPwdTA extends mm.TableActions {
  addUserPwd = mm.insertOne().setInputs();
}

export default mm.tableActions(t, UserPwdTA);
