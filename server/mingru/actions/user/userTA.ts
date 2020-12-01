import * as mm from 'mingru-models';
import t from '../../models/user/user';
import userStats from '../../models/user/userStats';

export const addUserInsertedIDVar = 'insertedUserID';

export class UserTA extends mm.TableActions {
  selectProfile = mm
    .select(t.id.privateAttr(), t.name, t.icon_name, t.location, t.company, t.website, t.bio)
    .by(t.id);
  selectSessionData = mm.select(t.id, t.name, t.icon_name, t.admin).by(t.id);
  selectEditingData = mm
    .select(
      t.id.privateAttr(),
      t.name,
      t.icon_name.privateAttr(),
      t.location,
      t.company,
      t.website,
      t.bio,
    )
    .by(t.id);
  selectIconName = mm.selectField(t.icon_name).by(t.id);
  selectIDFromEmail = mm.selectField(t.id).whereSQL(t.email.isEqualToInput());

  updateProfile = mm.updateOne().setInputs(t.name, t.website, t.company, t.location).by(t.id);
  updateIconName = mm.updateOne().setInputs(t.icon_name).by(t.id);
  updateBio = mm.updateOne().setInputs(t.bio).by(t.id);
  unsafeUpdateAdmin = mm.updateOne().setInputs(t.admin).by(t.id);

  private addUserEntryInternal = mm.insertOne().setDefaults().setInputs();
  private addUserStatsEntryInternal = mm.insertOne().from(userStats).setDefaults().setInputs();

  // Used by other user auth provider such as pwd provider to add an entry
  // in both user and user stats tables.
  getAddUserEntryTXMembers(): mm.TransactionMember[] {
    return [
      this.addUserEntryInternal.declareInsertedID(addUserInsertedIDVar),
      this.addUserStatsEntryInternal.wrap({ id: mm.valueRef(addUserInsertedIDVar) }),
    ];
  }
}

export default mm.tableActions(t, UserTA);
