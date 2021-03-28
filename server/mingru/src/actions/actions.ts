/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

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
import forumIsUserModTA from './forum/forumIsUserModTA';
import forumGroupModTA from './forum/forumGroupModTA';
import forumModTA from './forum/forumModTA';

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
  forumModTA,
  forumGroupModTA,
  forumIsUserModTA,
];

export default actions;
