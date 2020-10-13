import * as mm from 'mingru-models';
import t from '../../models/user/userPwd';
import userTA from './userTA';
import userAuthTA from './userAuthTA';
import { UserAuthType } from '../../models/user/userAuth';

const idVar = 'id';

export class UserPwdTA extends mm.TableActions {
  selectHashByID = mm.selectField(t.pwd_hash).byID();

  addUserPwdInternal = mm.insertOne().setInputs();

  addPwdBasedUser = mm
    .transact(
      userTA.addUserWithNameInternal.declareReturnValue(mm.ReturnValues.insertedID, idVar),
      userAuthTA.addUserAuth.wrap({
        authType: `${+UserAuthType.pwd}`,
        [idVar]: mm.valueRef(idVar),
      }),
      this.addUserPwdInternal.wrap({
        [idVar]: mm.valueRef(idVar),
      }),
    )
    .setReturnValues(idVar);
}

export default mm.tableActions(t, UserPwdTA);
