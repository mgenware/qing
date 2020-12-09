import * as mm from 'mingru-models';
import t from '../../models/user/userAuth';

export class UserAuthTA extends mm.TableActions {
  addUserAuth = mm.insertOne().setInputs();
}

export default mm.tableActions(t, UserAuthTA);
