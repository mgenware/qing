/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentCmtBase from '../../models/com/contentCmtCore.js';
import t from '../../models/qna/question.js';
import questionCmt from '../../models/qna/questionCmt.js';
import ThreadBaseTA from '../com/threadBaseTA.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';
import userStatsTA from '../user/userStatsTA.js';

export class QuestionTA extends ThreadBaseTA {
  updateMsgCount = updateCounterAction(t, t.reply_count);

  getBaseTable(): ContentBase {
    return t;
  }

  getCmtBaseTable(): ContentCmtBase {
    return questionCmt;
  }

  getPCColumns(): mm.SelectedColumn[] {
    return [t.title, t.reply_count];
  }

  getPCOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.reply_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.reply_count, t.votes, t.up_votes, t.down_votes];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateQuestionCount;
  }
}

export default mm.tableActions(t, QuestionTA);
