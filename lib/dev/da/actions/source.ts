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
import homeAG from './home/homeAG.js';
import comHomeAG from './home/comHomeAG.js';
import forumHomeAG from './home/forumHomeAG.js';
import threadAG from './thread/threadAG.js';
import threadMsgAG from './thread/threadMsgAG.js';
import forumGroupAG from './forum/forumGroupAG.js';
import forumAG from './forum/forumAG.js';
import forumIsUserModAG from './forum/forumIsUserModAG.js';
import forumGroupModAG from './forum/forumGroupModAG.js';
import forumModAG from './forum/forumModAG.js';
import { contentBaseStaticAG } from './com/contentBaseStaticAG.js';
import contentBaseCmtStaticAG from './cmt/contentBaseCmtStaticAG.js';
import { postStaticAG } from './post/postStaticAG.js';

const source: Array<mm.ActionGroup | mm.Table> = [
  userAG,
  userStatsAG,
  userAuthAG,
  userPwdAG,
  forumGroupAG,
  forumAG,
  forumModAG,
  forumGroupModAG,
  forumIsUserModAG,
  forumHomeAG,
  contentBaseStaticAG,
  contentBaseCmtStaticAG,
  cmtAG,
  postAG,
  postAG.baseCmtTable(),
  postStaticAG,
  threadAG,
  threadAG.baseCmtTable(),
  threadMsgAG,
  threadMsgAG.baseCmtTable(),
  homeAG,
  comHomeAG,
  ...likeAGs,
];

export default source;
