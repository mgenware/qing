import * as mm from 'mingru-models';

export class Forum extends mm.Table {
  id = mm.pk();
  display_name = mm.varChar(200);
  created_at = mm.datetime('utc');
  post_count = mm.uInt().default(0);
}

export default mm.table(Forum);
