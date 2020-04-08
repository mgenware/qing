import * as mm from 'mingru-models';
import t from '../models/userPwd';
import userTA from './userTA';

export class UserPwdTA extends mm.TableActions {
  addUserPwdInternal = mm.insertOne().setInputs();

  addPwdBasedUser = mm.transact(
    userTA.addUserWithNameInternal,
    this.addUserPwdInternal,
  );
}

export default mm.tableActions(t, UserPwdTA);
