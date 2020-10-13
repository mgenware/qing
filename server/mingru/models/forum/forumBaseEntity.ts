import * as mm from 'mingru-models';

export default class ForumBaseEntity extends mm.Table {
  id = mm.pk();
  display_name = mm.varChar(200);
  created_at = mm.datetime('utc');
  desc = mm.text().nullable;
}
