import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase';
import ContentCmtBase from '../../models/com/contentCmtCore';
import t from '../../models/qna/question';
import questionCmt from '../../models/qna/questionCmt';
import ThreadBaseTA from '../com/threadBaseTA';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import userStatsTA from '../user/userStatsTA';

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
    return [t.title, t.cmt_count, t.reply_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateQuestionCount;
  }
}

export default mm.tableActions(t, QuestionTA);
