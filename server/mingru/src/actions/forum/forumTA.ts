import * as mm from 'mingru-models';
import ThreadBase from '../../models/com/threadBase';
import discussion from '../../models/discussion/discussion';
import t from '../../models/forum/forum';
import question from '../../models/qna/question';
import user from '../../models/user/user';
import { UserThreadInterface } from '../common';
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
      .selectPage(this.typeCol(defs.tabDiscussion), ...this.getDefaultThreadCols(discussion))
      .from(discussion)
      .orderByAsc(discussion.last_replied_at)
      .resultTypeNameAttr(UserThreadInterface);
    this.selectQuestions = mm
      .selectPage(this.typeCol(defs.tabQuestion), ...this.getDefaultThreadCols(question))
      .from(question)
      .orderByAsc(question.last_replied_at)
      .resultTypeNameAttr(UserThreadInterface);
    this.selectThreads = this.selectDiscussions
      .union(this.selectQuestions, true)
      .orderByDesc(discussion.created_at)
      .resultTypeNameAttr(UserThreadInterface);
  }

  private typeCol(itemType: number): mm.RawColumn {
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
