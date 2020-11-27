import * as mm from 'mingru-models';
import discussion from './discussion';
import PostCore from '../post/postCore';

export class DiscussionMsg extends PostCore {
  discussion_id = discussion.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(DiscussionMsg);
