import * as dd from 'dd-models';
import t from './user';

const userTA = dd.actions(t);
userTA
  .select('UserProfile', t.id, t.location, t.company, t.website, t.sig)
  .byID();

export default userTA;
