import * as mm from 'mingru-models';
import userTA from './actions/userTA';
import postTA from './actions/postTA';
import userStatsTA from './actions/userStatsTA';
import cmtTA from './actions/cmtTA';
import replyTA from './actions/replyTA';
import userAuthTA from './actions/userAuthTA';
import userPwdTA from './actions/userPwdTA';
import likeTAs from './actions/likeTAs';
import forumPostTA from './actions/forumPostTA';

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
