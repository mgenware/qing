import * as mm from 'mingru-models';

export default class ForumCoreTable extends mm.Table {
  id = mm.pk();
  name = mm.varChar(100);
  desc = mm.text().setModelName('DescHTML');

  created_at = mm.datetime('utc');
  desc_modified_at = mm.datetime('utc').nullable;
}
