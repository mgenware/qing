import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase';
import ContentCmtBase from '../../models/com/contentCmtCore';
import t from '../../models/qna/answer';
import answerCmt from '../../models/qna/answerCmt';
import ContentBaseTA from '../com/contentBaseTA';
import questionTA from './questionTA';

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
