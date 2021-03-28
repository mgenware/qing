/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import post from './post/post';
import user from './user/user';
import { cmt, reply } from './cmt/cmt';
import postCmt from './post/postCmt';
import userStats from './user/userStats';
import userPwd from './user/userPwd';
import userAuth from './user/userAuth';
import likes from './like/likeableTables';
import discussion from './discussion/discussion';
import discussionCmt from './discussion/discussionCmt';
import discussionMsg from './discussion/discussionMsg';
import discussionMsgCmt from './discussion/discussionMsgCmt';
import question from './qna/question';
import questionCmt from './qna/questionCmt';
import answer from './qna/answer';
import answerCmt from './qna/answerCmt';
import forumGroup from './forum/forumGroup';
import forum from './forum/forum';
import forumMod from './forum/forumMod';
import forumGroupMod from './forum/forumGroupMod';
import forumIsUserMod from './forum/forumIsUserMod';

const tables: mm.Table[] = [
  user,
  cmt,
  reply,
  post,
  postCmt,
  userStats,
  userPwd,
  userAuth,
  discussion,
  discussionCmt,
  discussionMsg,
  discussionMsgCmt,
  question,
  questionCmt,
  answer,
  answerCmt,
  ...likes.values(),
  forum,
  forumGroup,
  forumMod,
  forumGroupMod,
  forumIsUserMod,
];
export default tables;
