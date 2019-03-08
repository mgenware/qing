import * as dd from 'dd-models';
import t from './user';

const ta = dd.actions(t);
ta.select(
  'Profile',
  t.id,
  t.name,
  t.icon_name,
  t.location,
  t.company,
  t.website,
  t.bio,
).byID();

ta.select('SessionData', t.id, t.name, t.icon_name).byID();

ta.select(
  'EditingData',
  t.id,
  t.name,
  t.icon_name,
  t.location,
  t.company,
  t.website,
  t.bio,
  t.bio_src,
);

ta.updateOne('EditingData')
  .setInputs(t.name, t.website, t.company, t.location)
  .byID();

export default ta;
