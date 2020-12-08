import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import question from './question';

export class QuestionCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return question;
  }
}

export default mm.table(QuestionCmt);
