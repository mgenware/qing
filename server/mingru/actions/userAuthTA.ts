import * as mm from 'mingru-models';
import t from '../models/userAuth';

export class UserAuthTA extends mm.TableActions {
  addUserAuth = mm.insertOne().setInputs();
}

export default mm.tableActions(t, UserAuthTA);
