import * as mm from 'mingru-models';
import t from '../models/userPwd';
import userTA from './userTA';

export class UserPwdTA extends mm.TableActions {
  addUserPwd = mm.insertOne().setInputs();

  addPwdBasedUser = mm.transact(userTA.addUserWithName, this.addUserPwd);
}

export default mm.tableActions(t, UserPwdTA);
