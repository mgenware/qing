/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import userTA from './user/userTA.js';
import postTA from './post/postTA.js';
import userStatsTA from './user/userStatsTA.js';
import cmtTA from './cmt/cmtTA.js';
import userAuthTA from './user/userAuthTA.js';
import userPwdTA from './user/userPwdTA.js';
import likeTAs from './like/likeTAs.js';
import discussionTA from './discussion/discussionTA.js';
import discussionMsgTA from './discussion/discussionMsgTA.js';
import homeTA from './home/homeTA.js';
import questionTA from './qna/questionTA.js';
import answerTA from './qna/answerTA.js';
import forumGroupTA from './forum/forumGroupTA.js';
import forumTA from './forum/forumTA.js';
import forumIsUserModTA from './forum/forumIsUserModTA.js';
import forumGroupModTA from './forum/forumGroupModTA.js';
import forumModTA from './forum/forumModTA.js';
import voteTAs from './vote/voteTAs.js';
import { contentBaseUtilTA } from './com/contentBaseUtilTA.js';
import contentBaseCmtUtilTA from './cmt/contentBaseCmtUtilTA.js';

const source: Array<mm.TableActions | mm.Table> = [
  userTA,
  userStatsTA,
  userAuthTA,
  userPwdTA,
  cmtTA,
  postTA,
  postTA.getCmtBaseTable(),
  discussionTA,
  discussionTA.getCmtBaseTable(),
  discussionMsgTA,
  discussionMsgTA.getCmtBaseTable(),
  homeTA,
  questionTA,
  questionTA.getCmtBaseTable(),
  answerTA,
  answerTA.getCmtBaseTable(),
  forumTA,
  forumGroupTA,
  forumModTA,
  forumGroupModTA,
  forumIsUserModTA,
  contentBaseUtilTA,
  contentBaseCmtUtilTA,
  ...likeTAs,
  ...voteTAs,
];

export default source;
