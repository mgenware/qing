import * as mm from 'mingru-models';
import t from '../../models/user/user';

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
  addUserWithNameInternal = mm.insertOne().setDefaults().setInputs();
}

export default mm.tableActions(t, UserTA);
