import * as dd from 'dd-models';
import t from './user';

const userTA = dd.actions(t);
userTA
  .select(
    'UserProfile',
    t.id,
    t.name,
    t.icon_name,
    t.location,
    t.company,
    t.website,
    t.bio,
  )
  .byID();

export default userTA;
