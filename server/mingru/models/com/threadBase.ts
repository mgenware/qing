import * as mm from 'mingru-models';
import forum from '../forum/forum';
import ContentWithTitleBase from './contentWithTitleBase';

export default class ThreadBase extends ContentWithTitleBase {
  forum_id = mm.fk(forum.id).nullable;
  reply_count = mm.uInt().default(0);
  last_replied_at = mm.datetime('utc').nullable.default(null);
}
