import * as mm from 'mingru-models';
import discussion from '../../models/discussion/discussion';
import t from '../../models/forum/forum';
import question from '../../models/qna/question';
import {
  getUserDiscussionCols,
  getUserQuestionCols,
  userThreadInterface,
  userThreadTypeColumnName,
} from '../com/userThreadCommon';
import defs from '../defs';

export class ForumTA extends mm.TableActions {
  selectForum = mm.select(t.id, t.name, t.desc, t.created_at, t.thread_count).by(t.id);

  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).by(t.id);
  insertItem = mm.insertOne().setInputs(t.name, t.desc).setInputs();

  // Select threads.
  selectThreads: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectQuestions: mm.SelectAction;

  constructor() {
    super();

    this.selectDiscussions = mm
      .selectPage(this.typeCol(defs.threadTypeDiscussion), ...getUserDiscussionCols(discussion))
      .from(discussion)
      .orderByAsc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectQuestions = mm
      .selectPage(this.typeCol(defs.threadTypeQuestion), ...getUserQuestionCols(question))
      .from(question)
      .orderByAsc(question.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);

    this.selectThreads = this.selectDiscussions
      .union(this.selectQuestions, true)
      .orderByDesc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
  }

  private typeCol(itemType: number): mm.RawColumn {
    return new mm.RawColumn(
      mm.sql`${itemType.toString()}`,
      userThreadTypeColumnName,
      mm.int().__type,
    );
  }
}

export default mm.tableActions(t, ForumTA);
