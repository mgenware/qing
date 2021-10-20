/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import forumIsUserMod from '../../models/forum/forumIsUserMod.js';
import t from '../../models/user/user.js';
import userStats from '../../models/user/userStats.js';

export const addUserInsertedIDVar = 'insertedUserID';
const findUserResult = 'FindUserResult';
const coreCols = [t.id.privateAttr(), t.name, t.icon_name.privateAttr()];
const sessionCols = [...coreCols, t.admin];

export class UserTA extends mm.TableActions {
  selectProfile = mm.selectRow(...coreCols, t.location, t.company, t.website, t.bio).by(t.id);
  selectSessionData = mm
    .selectRow(...sessionCols)
    .by(t.id)
    .attr(mm.ActionAttribute.ignorePrivateColumns, true);
  selectSessionDataForumMode = mm
    .selectRow(...sessionCols, t.id.leftJoin(forumIsUserMod).id.as('is_forum_mod'))
    .by(t.id)
    .attr(mm.ActionAttribute.ignorePrivateColumns, true);
  selectEditingData = mm.selectRow(...coreCols, t.location, t.company, t.website, t.bio).by(t.id);
  selectIconName = mm.selectField(t.icon_name).by(t.id);
  selectIDFromEmail = mm.selectField(t.id).whereSQL(t.email.isEqualToInput());
  selectIsAdmin = mm.selectField(t.admin).by(t.id);
  selectName = mm.selectField(t.name).by(t.id);

  findUserByID = mm
    .selectRow(...coreCols)
    .by(t.id)
    .resultTypeNameAttr(findUserResult);
  findUsersByName = mm.selectRows(...coreCols).where`${t.name} LIKE ${t.name.toInput()}`
    .noOrderBy()
    .resultTypeNameAttr(findUserResult);

  updateProfile = mm
    .updateOne()
    .setInputs(t.name, t.website, t.company, t.location, t.bio)
    .by(t.id);
  updateIconName = mm.updateOne().setInputs(t.icon_name).by(t.id);

  // Unsafe methods. Need extra admin check.
  unsafeSelectAdmins = mm.selectRows(...coreCols).where`${t.admin} = 1`.orderByAsc(t.id);
  unsafeUpdateAdmin = mm.updateOne().setInputs(t.admin).by(t.id);

  private addUserEntryInternal = mm.insertOne().setDefaults().setInputs();
  private addUserStatsEntryInternal = mm.insertOne().from(userStats).setDefaults().setInputs();

  // Used by other user auth provider such as pwd provider to add an entry
  // in both user and user stats tables.
  getAddUserEntryTXMembers(): mm.TransactionMemberTypes[] {
    return [
      this.addUserEntryInternal.declareInsertedID(addUserInsertedIDVar),
      this.addUserStatsEntryInternal.wrap({ id: mm.valueRef(addUserInsertedIDVar) }),
    ];
  }

  testAddUser = mm
    .transact(...this.getAddUserEntryTXMembers())
    .setReturnValues(addUserInsertedIDVar);

  testEraseUser = mm.transact(
    mm.deleteSome().by(t.id),
    mm.deleteSome().from(userStats).by(userStats.id),
  );
}

export default mm.tableActions(t, UserTA);
