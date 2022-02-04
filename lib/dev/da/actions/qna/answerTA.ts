/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
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

  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentBaseCmt {
    return answerCmt;
  }

  // Post center is not supported.
  override getPCColumns(): mm.SelectedColumn[] {
    return [];
  }

  override getPCOrderByColumns(): mm.SelectedColumn[] {
    return [];
  }

  // Profile is not supported.
  override getProfileColumns(): mm.SelectedColumn[] {
    return [];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), t.cmt_count, t.up_votes, t.down_votes, t.votes];
  }

  override getContainerUpdateCounterAction(): mm.Action {
    return questionTA.updateMsgCount.wrap({ id: mm.valueRef(questionID), offset: -1 });
  }

  override getExtraInsertionInputColumns(): mm.Column[] {
    return [t.question_id];
  }

  override deleteItemOverride(): mm.Action | null {
    return mm.transact(
      mm.selectField(t.question_id).by(t.id).declareReturnValue(mm.ReturnValues.result, questionID),
      mm.deleteOne().whereSQL(this.updateConditions),
      this.getContainerUpdateCounterAction(),
    );
  }
}

export default mm.tableActions(t, AnswerTA);
