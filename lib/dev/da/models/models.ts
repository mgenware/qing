/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import post from './post/post.js';
import user from './user/user.js';
import { cmt, reply } from './cmt/cmt.js';
import postCmt from './post/postCmt.js';
import userStats from './user/userStats.js';
import userPwd from './user/userPwd.js';
import userAuth from './user/userAuth.js';
import likes from './like/likeableTables.js';
import votes from './vote/votableTables.js';
import discussion from './discussion/discussion.js';
import discussionCmt from './discussion/discussionCmt.js';
import discussionMsg from './discussion/discussionMsg.js';
import discussionMsgCmt from './discussion/discussionMsgCmt.js';
import question from './qna/question.js';
import questionCmt from './qna/questionCmt.js';
import answer from './qna/answer.js';
import answerCmt from './qna/answerCmt.js';
import forumGroup from './forum/forumGroup.js';
import forum from './forum/forum.js';
import forumMod from './forum/forumMod.js';
import forumGroupMod from './forum/forumGroupMod.js';
import forumIsUserMod from './forum/forumIsUserMod.js';

const tables: mm.Table[] = [
  user,
  userStats,
  userPwd,
  userAuth,
  forumGroup,
  forum,
  forumMod,
  forumGroupMod,
  forumIsUserMod,
  cmt,
  reply,
  post,
  postCmt,
  discussion,
  discussionCmt,
  discussionMsg,
  discussionMsgCmt,
  question,
  questionCmt,
  answer,
  answerCmt,
  ...likes.values(),
  ...votes.values(),
];
export default tables;
