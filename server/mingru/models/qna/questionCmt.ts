import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import question from './question';

export class QuestionCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return question;
  }
}

export default mm.table(QuestionCmt);
