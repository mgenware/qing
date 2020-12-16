import * as mm from 'mingru-models';

export class ForumIsUserMod extends mm.Table {
  id = mm.pk();
}

export default mm.table(ForumIsUserMod);
