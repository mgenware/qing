/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt';
import t from '../../models/qna/question.js';
import questionCmt from '../../models/qna/questionCmt.js';
import ThreadBaseTA from '../com/threadBaseTA.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';
import userStatsTA from '../user/userStatsTA.js';

export class QuestionTA extends ThreadBaseTA {
  updateMsgCount = updateCounterAction(t, t.reply_count);

  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentBaseCmt {
    return questionCmt;
  }

  override getPCColumns(): mm.SelectedColumnTypes[] {
    return [t.title, t.reply_count];
  }

  override getPCOrderByColumns(): mm.SelectedColumnTypes[] {
    return [t.created_at, t.reply_count];
  }

  override getProfileColumns(): mm.SelectedColumnTypes[] {
    return [t.title];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), t.title, t.cmt_count, t.reply_count, t.likes];
  }

  override getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateQuestionCount;
  }
}

export default mm.tableActions(t, QuestionTA);
