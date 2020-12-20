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
  selectForum = mm.selectRow(t.id, t.name, t.desc, t.created_at, t.thread_count).by(t.id);
  selectGroupID = mm.selectField(t.group_id).by(t.id);
  selectGroupForumIDs = mm.selectFieldRows(t.id).pageMode().by(t.group_id).noOrderBy();

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
      .selectRows(
        this.typeCol(defs.threadTypeDiscussion),
        ...getUserDiscussionCols(discussion, true),
      )
      .from(discussion)
      .pageMode()
      .orderByAsc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectQuestions = mm
      .selectRows(this.typeCol(defs.threadTypeQuestion), ...getUserQuestionCols(question, true))
      .from(question)
      .pageMode()
      .orderByAsc(question.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);

    this.selectThreads = this.selectDiscussions
      .union(this.selectQuestions)
      .pageMode()
      .orderByDesc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
  }

  private typeCol(itemType: number): mm.RawColumn {
    return new mm.RawColumn(
      mm.sql`${itemType.toString()}`,
      userThreadTypeColumnName,
      mm.int().__mustGetType(),
    );
  }
}

export default mm.tableActions(t, ForumTA);
