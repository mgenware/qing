import * as mm from 'mingru-models';
import t from '../../models/forum/forumMod';
import { createForumModTA } from './forumModTAFactory';

export default createForumModTA(t, {
  deleteUserFromForumMods: mm
    .deleteSome()
    .whereSQL(mm.and(t.user_id.isEqualToInput(), t.object_id.isInArrayInput('forumIDs'))),
});
