import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/qna/question';
import questionCmt from '../../models/qna/questionCmt';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import PostTACore from '../post/postTACore';
import userStatsTA from '../user/userStatsTA';

export class QuestionTA extends PostTACore {
  updateMsgCount = updateCounterAction(t, t.answer_count);

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return questionCmt;
  }

  getDashboardColumns(): mm.SelectActionColumns[] {
    return [t.title, t.answer_count];
  }

  getDashboardOrderByColumns(): mm.SelectActionColumns[] {
    return [t.created_at, t.answer_count];
  }

  getProfileColumns(): mm.SelectActionColumns[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectActionColumns[] {
    return [t.title, t.cmt_count, t.answer_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateQuestionCount;
  }
}

export default mm.tableActions(t, QuestionTA);
