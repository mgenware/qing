import * as mm from 'mingru-models';
import PostCore from '../post/postCore';

export class Discussion extends PostCore {
  title = mm.varChar(255);

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);

  msg_count = mm.uInt().default(0);
}

export default mm.table(Discussion);
