import * as mm from 'mingru-models';

export default class ForumBase extends mm.Table {
  id = mm.pk();
  name = mm.varChar(100);
  short_desc = mm.varChar(300);
  long_desc = mm.text().setModelName('LongDescHTML');
  order_index = mm.uInt().default(0);

  created_at = mm.datetime('utc');
}
