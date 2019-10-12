import * as dd from 'mingru-models';
import t from './user';

export class UserTA extends dd.TableActions {
  selectProfile = dd
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
  selectSessionData = dd.select(t.id, t.name, t.icon_name).byID();
  selectEditingData = dd
    .select(t.id, t.name, t.icon_name, t.location, t.company, t.website, t.bio)
    .byID();
  selectIconName = dd.selectField(t.icon_name).byID();

  updateProfile = dd
    .updateOne()
    .setInputs(t.name, t.website, t.company, t.location)
    .byID();
  updateIconName = dd
    .updateOne()
    .setInputs(t.icon_name)
    .byID();

  updateBio = dd
    .updateOne()
    .setInputs(t.bio)
    .byID();
  updatePostCount = dd
    .updateOne()
    .set(t.postCount, dd.sql`${t.postCount} + ${dd.input(dd.int(), 'offset')}`)
    .byID('userID');
}

export default dd.ta(t, UserTA);
