import * as mm from 'mingru-models';
import t from '../../models/user/user';
import userStats from '../../models/user/userStats';

const userIDVar = 'userID';

export class UserTA extends mm.TableActions {
  selectProfile = mm
    .select(t.id.privateAttr(), t.name, t.icon_name, t.location, t.company, t.website, t.bio)
    .by(t.id);
  selectSessionData = mm.select(t.id, t.name, t.icon_name).by(t.id);
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

  // Called by other user auth provider such as pwd provider to add an user entry.
  // This also inserts a row in user stats table.
  addUserWithNameInternal = mm
    .transact(
      mm.insertOne().setDefaults().setInputs().declareInsertedID(userIDVar),
      mm
        .insertOne()
        .from(userStats)
        .setDefaults()
        .setInputs()
        .wrap({ id: mm.valueRef('id') }),
    )
    .setReturnValues(userIDVar);
}

export default mm.tableActions(t, UserTA);
