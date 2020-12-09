import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import answer from './answer';

export class AnswerCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return answer;
  }
}

export default mm.table(AnswerCmt);
