/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentCmtBase from '../../models/com/contentCmtCore.js';
import t from '../../models/qna/answer.js';
import answerCmt from '../../models/qna/answerCmt.js';
import ContentBaseTA from '../com/contentBaseTA.js';
import questionTA from './questionTA.js';

const questionID = 'questionID';

export class AnswerTA extends ContentBaseTA {
  selectItemsByQuestion: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, answers are fetched along with
    // their belonging question.
    this.selectItemByID = mm.emptyAction;
    this.selectItemsByQuestion = mm
      .selectRows(...this.getFullColumns())
      .pageMode()
      .by(t.question_id)
      .orderByAsc(t.created_at);
  }

  getBaseTable(): ContentBase {
    return t;
  }

  getCmtBaseTable(): ContentCmtBase {
    return answerCmt;
  }

  // Post center is not supported.
  getPCColumns(): mm.SelectedColumn[] {
    return [];
  }

  getPCOrderByColumns(): mm.SelectedColumn[] {
    return [];
  }

  // Profile is not supported.
  getProfileColumns(): mm.SelectedColumn[] {
    return [];
  }

  getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return questionTA.updateMsgCount.wrap({ id: mm.valueRef(questionID), offset: '-1' });
  }

  getExtraInsertionInputColumns(): mm.Column[] {
    return [t.question_id];
  }

  deleteItemOverride(): mm.Action | null {
    return mm.transact(
      mm.selectField(t.question_id).by(t.id).declareReturnValue(mm.ReturnValues.result, questionID),
      mm.deleteOne().whereSQL(this.updateConditions),
      this.getContainerUpdateCounterAction(),
    );
  }
}

export default mm.tableActions(t, AnswerTA);
