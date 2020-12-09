import * as mm from 'mingru-models';

export default class ForumBase extends mm.Table {
  id = mm.pk();
  name = mm.varChar(100);
  desc = mm.text().setModelName('DescHTML');
  order_index = mm.uInt().default(0);

  created_at = mm.datetime('utc');
  desc_modified_at = mm.datetime('utc').nullable;
}
