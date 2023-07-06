/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userPwd.js';
import userAG, { addUserInsertedIDVar } from './userAG.js';
import userAuthAG from './userAuthAG.js';
import { UserAuthType } from '../../models/user/userAuth.js';

export class UserPwdAG extends mm.ActionGroup {
  selectHashByID = mm.selectField(t.pwd_hash).by(t.id);

  updateHashByID = mm.updateOne().setParams(t.pwd_hash).by(t.id);

  addUserPwdInternal = mm.insertOne().setParams();

  addPwdBasedUser = mm
    .transact(
      ...userAG.getAddUserEntryTXMembers(),
      userAuthAG.addUserAuth.wrap({
        authType: `${+UserAuthType.pwd}`,
        id: mm.captureVar(addUserInsertedIDVar),
      }),
      this.addUserPwdInternal.wrap({
        id: mm.captureVar(addUserInsertedIDVar),
      }),
    )
    .setReturnValues(addUserInsertedIDVar);
  testDelete = mm.deleteSome().by(t.id);
}

export default mm.actionGroup(t, UserPwdAG);
