/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userPwd';
import userTA, { addUserInsertedIDVar } from './userTA';
import userAuthTA from './userAuthTA';
import userAuth, { UserAuthType } from '../../models/user/userAuth';
import userStats from '../../models/user/userStats';
import user from '../../models/user/user';

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

  testEraseUser = mm.transact(
    mm.deleteSome().by(t.id),
    mm.deleteSome().from(userAuth).by(userAuth.id),
    mm.deleteSome().from(userStats).by(userStats.id),
    mm.deleteSome().from(user).by(user.id),
  );
}

export default mm.tableActions(t, UserPwdTA);
