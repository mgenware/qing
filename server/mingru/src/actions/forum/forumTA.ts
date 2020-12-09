import * as mm from 'mingru-models';
import ThreadBase from '../../models/com/threadBase';
import discussion from '../../models/discussion/discussion';
import t from '../../models/forum/forum';
import question from '../../models/qna/question';
import user from '../../models/user/user';

const threadTypeName = 'threadType';
const threadTypeInterface = 'ThreadInterface';
enum ThreadType {
  discussionType = 1,
  questionType,
}

export class ForumTA extends mm.TableActions {
  selectForum = mm
    .select(t.id, t.name, t.desc, t.created_at, t.desc_modified_at, t.thread_count)
    .by(t.id);

  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).setDefaults(t.desc_modified_at).by(t.id);
  insertItem = mm.insertOne().setInputs(t.name, t.desc).setInputs();

  // Select threads.
  selectThreads: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectQuestions: mm.SelectAction;

  constructor() {
    super();

    this.selectDiscussions = mm
      .selectPage(this.typeCol(ThreadType.discussionType), ...this.getDefaultThreadCols(discussion))
      .from(discussion)
      .orderByAsc(discussion.last_replied_at)
      .attr(mm.ActionAttributes.resultTypeName, threadTypeInterface);
    this.selectQuestions = mm
      .selectPage(this.typeCol(ThreadType.questionType), ...this.getDefaultThreadCols(question))
      .from(question)
      .orderByAsc(question.last_replied_at)
      .attr(mm.ActionAttributes.resultTypeName, threadTypeInterface);
    this.selectThreads = this.selectDiscussions
      .union(this.selectQuestions, true)
      .orderByDesc(discussion.created_at)
      .attr(mm.ActionAttributes.resultTypeName, threadTypeInterface);
  }

  private typeCol(itemType: ThreadType): mm.RawColumn {
    return new mm.RawColumn(mm.sql`${itemType.toString()}`, threadTypeName, mm.int().__type);
  }

  private getDefaultThreadCols(th: ThreadBase): mm.SelectedColumn[] {
    const joinedUserTable = th.user_id.join(user);
    const privateCols = [
      th.id,
      th.user_id,
      joinedUserTable.name,
      joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());

    return [...privateCols, th.title, th.created_at, th.last_replied_at, th.reply_count];
  }
}

export default mm.tableActions(t, ForumTA);
