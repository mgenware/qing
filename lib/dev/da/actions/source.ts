/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import userAG from './user/userAG.js';
import postAG from './post/postAG.js';
import userStatsAG from './user/userStatsAG.js';
import cmtAG from './cmt/cmtAG.js';
import userAuthAG from './user/userAuthAG.js';
import userPwdAG from './user/userPwdAG.js';
import likeAGs from './like/likeAGs.js';
import discussionAG from './discussion/discussionAG.js';
import discussionMsgAG from './discussion/discussionMsgAG.js';
import homeAG from './home/homeAG.js';
import questionAG from './qna/questionAG.js';
import answerAG from './qna/answerAG.js';
import forumGroupAG from './forum/forumGroupAG.js';
import forumAG from './forum/forumAG.js';
import forumIsUserModAG from './forum/forumIsUserModAG.js';
import forumGroupModAG from './forum/forumGroupModAG.js';
import forumModAG from './forum/forumModAG.js';
import voteAGs from './vote/voteAGs.js';
import { contentBaseUtilAG } from './com/contentBaseUtilAG.js';
import contentBaseCmtUtilAG from './cmt/contentBaseCmtUtilAG.js';
import { threadBaseUtilAG } from './com/threadBaseUtilAG.js';

const source: Array<mm.ActionGroup | mm.Table> = [
  userAG,
  userStatsAG,
  userAuthAG,
  userPwdAG,
  cmtAG,
  postAG,
  postAG.getCmtBaseTable(),
  discussionAG,
  discussionAG.getCmtBaseTable(),
  discussionMsgAG,
  discussionMsgAG.getCmtBaseTable(),
  homeAG,
  questionAG,
  questionAG.getCmtBaseTable(),
  answerAG,
  answerAG.getCmtBaseTable(),
  forumAG,
  forumGroupAG,
  forumModAG,
  forumGroupModAG,
  forumIsUserModAG,
  contentBaseUtilAG,
  contentBaseCmtUtilAG,
  threadBaseUtilAG,
  ...likeAGs,
  ...voteAGs,
];

export default source;
