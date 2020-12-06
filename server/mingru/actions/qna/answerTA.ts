import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/qna/answer';
import answerCmt from '../../models/qna/answerCmt';
import PostTACore from '../post/postTACore';
import questionTA from './questionTA';

const questionID = 'questionID';

export class AnswerTA extends PostTACore {
  selectItemsByQuestion: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, answers are fetched along with
    // their belonging question.
    this.selectItemByID = mm.emptyAction as mm.SelectAction;
    this.selectItemsByQuestion = mm
      .selectPage(...this.getFullColumns())
      .by(t.question_id)
      .orderByAsc(t.created_at);
  }

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return answerCmt;
  }

  // Dashboard is not supported.
  getDashboardColumns(): mm.SelectedColumn[] {
    return [];
  }

  getDashboardOrderByColumns(): mm.SelectedColumn[] {
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
