import * as mm from 'mingru-models';
import question from './question';
import PostCore from '../post/postCore';

export class Answer extends PostCore {
  question_id = question.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(Answer);
