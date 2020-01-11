import * as mm from 'mingru-models';
import t from '../models/user';

export class UserTA extends mm.TableActions {
  selectProfile = mm
    .select(
      t.id,
      t.name,
      t.icon_name,
      t.location,
      t.company,
      t.website,
      t.bio,
      t.postCount,
    )
    .byID();
  selectSessionData = mm.select(t.id, t.name, t.icon_name).byID();
  selectEditingData = mm
    .select(
      t.id,
      t.name,
      t.icon_name.attr(mm.ColumnAttributes.isPrivate, true),
      t.location,
      t.company,
      t.website,
      t.bio,
    )
    .byID();
  selectIconName = mm.selectField(t.icon_name).byID();

  updateProfile = mm
    .updateOne()
    .setInputs(t.name, t.website, t.company, t.location)
    .byID();
  updateIconName = mm
    .updateOne()
    .setInputs(t.icon_name)
    .byID();

  updateBio = mm
    .updateOne()
    .setInputs(t.bio)
    .byID();
  updatePostCount = mm
    .updateOne()
    .set(t.postCount, mm.sql`${t.postCount} + ${mm.input(mm.int(), 'offset')}`)
    .byID('userID');
}

export default mm.tableActions(t, UserTA);
