import * as mm from 'mingru-models';
import userTA from './user/userTA';
import postTA from './post/postTA';
import userStatsTA from './user/userStatsTA';
import cmtTA from './cmt/cmtTA';
import replyTA from './cmt/replyTA';
import userAuthTA from './user/userAuthTA';
import userPwdTA from './user/userPwdTA';
import likeTAs from './like/likeTAs';
import forumPostTA from './forum/forumPostTA';

const actions: mm.TableActions[] = [
  userTA,
  postTA,
  userStatsTA,
  cmtTA,
  replyTA,
  userAuthTA,
  userPwdTA,
  forumPostTA,
  ...likeTAs,
];

export default actions;
