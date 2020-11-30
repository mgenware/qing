import * as mm from 'mingru-models';
import PostCore from '../post/postCore';

export class Question extends PostCore {
  title = mm.varChar(255);

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);

  answer_count = mm.uInt().default(0);
}

export default mm.table(Question);