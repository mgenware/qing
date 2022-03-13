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
import ContentBaseAG from '../com/contentBaseAG.js';
import { threadBaseUtilAG, threadBaseTableParam } from '../com/threadBaseUtilAG.js';

const questionID = 'questionID';

export class AnswerAG extends ContentBaseAG {
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

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [
      threadBaseUtilAG.updateReplyCount.wrap({
        [threadBaseTableParam]: t,
        id: mm.captureVar(questionID),
      }),
    ];
  }

  override getExtraInsertionInputColumns(): mm.Column[] {
    return [t.question_id];
  }

  override deleteItemOverride(): mm.Action | null {
    return mm.transact(
      mm.selectField(t.question_id).by(t.id).declareReturnValue(mm.ReturnValues.result, questionID),
      mm.deleteOne().whereSQL(this.updateConditions),
      ...this.getDecrementContainerCounterActions(),
    );
  }
}

export default mm.actionGroup(t, AnswerAG);
