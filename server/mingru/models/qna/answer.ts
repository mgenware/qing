import * as mm from 'mingru-models';
import question from './question';
import ContentBase from '../com/contentBase';

export class Answer extends ContentBase {
  question_id = question.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(Answer);
