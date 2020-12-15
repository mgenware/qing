import * as mm from 'mingru-models';
import userTA from './user/userTA';
import postTA from './post/postTA';
import userStatsTA from './user/userStatsTA';
import cmtTA from './cmt/cmtTA';
import replyTA from './cmt/replyTA';
import userAuthTA from './user/userAuthTA';
import userPwdTA from './user/userPwdTA';
import likeTAs from './like/likeTAs';
import discussionTA from './discussion/discussionTA';
import discussionMsgTA from './discussion/discussionMsgTA';
import homeTA from './home/homeTA';
import questionTA from './qna/questionTA';
import answerTA from './qna/answerTA';
import forumGroupTA from './forum/forumGroupTA';
import forumTA from './forum/forumTA';
import { createPermBaseTA } from './com/permBaseTAFactory';
import forumPerm from '../models/forum/forumPerm';
import forumGroupPerm from '../models/forum/forumGroupPerm';

const actions: mm.TableActions[] = [
  userTA,
  postTA,
  userStatsTA,
  cmtTA,
  replyTA,
  userAuthTA,
  userPwdTA,
  discussionTA,
  discussionMsgTA,
  ...likeTAs,
  homeTA,
  questionTA,
  answerTA,
  forumTA,
  forumGroupTA,
  createPermBaseTA(forumPerm),
  createPermBaseTA(forumGroupPerm),
];

export default actions;
