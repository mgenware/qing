/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userPwd.js';
import userTA, { addUserInsertedIDVar } from './userTA.js';
import userAuthTA from './userAuthTA.js';
import { UserAuthType } from '../../models/user/userAuth.js';

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
