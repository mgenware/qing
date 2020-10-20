import * as mm from 'mingru-models';
import t from '../../models/user/userPwd';
import userTA, { addUserInsertedIDVar } from './userTA';
import userAuthTA from './userAuthTA';
import { UserAuthType } from '../../models/user/userAuth';

export class UserPwdTA extends mm.TableActions {
  selectHashByID = mm.selectField(t.pwd_hash).by(t.id);

  addUserPwdInternal = mm.insertOne().setInputs();

  addPwdBasedUser = mm
    .transact(
      ...userTA.getAddUserEntryTXMembers(),
      userAuthTA.addUserAuth.wrap({
        authType: `${+UserAuthType.pwd}`,
        id: mm.valueRef(addUserInsertedIDVar),
      }),
      this.addUserPwdInternal.wrap({
        id: mm.valueRef(addUserInsertedIDVar),
      }),
    )
    .setReturnValues(addUserInsertedIDVar);
}

export default mm.tableActions(t, UserPwdTA);
