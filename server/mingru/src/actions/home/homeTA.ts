import * as mm from 'mingru-models';
import post from '../../models/post/post';
import discussion from '../../models/discussion/discussion';
import forumGroup, { ForumGroup } from '../../models/forum/forumGroup';
import forum, { Forum } from '../../models/forum/forum';
import question from '../../models/qna/question';
import defs from '../defs';
import {
  getUserPostCols,
  userThreadInterface,
  getUserQuestionCols,
  getUserDiscussionCols,
  userThreadTypeColumnName,
} from '../com/userThreadCommon';

export class Home extends mm.GhostTable {}

export class HomeTA extends mm.TableActions {
  // Non-forum mode.
  selectPosts: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectQuestions: mm.SelectAction;
  selectItems: mm.SelectAction;

  // Forum mode.
  selectForumGroups = mm
    .selectRows(...this.getForumGroupCols(forumGroup))
    .from(forumGroup)
    .orderByDesc(forumGroup.order_index);
  selectForums = mm.selectRows(...this.getForumCols(forum)).from(forum).noOrderBy;

  constructor() {
    super();

    this.selectPosts = mm
      .selectPage(this.typeCol(defs.threadTypePost), ...getUserPostCols(post))
      .from(post)
      .orderByAsc(post.created_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectQuestions = mm
      .selectPage(this.typeCol(defs.threadTypeQuestion), ...getUserQuestionCols(question, false))
      .from(question)
      .orderByAsc(question.created_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectDiscussions = mm
      .selectPage(
        this.typeCol(defs.threadTypeDiscussion),
        ...getUserDiscussionCols(discussion, false),
      )
      .from(discussion)
      .orderByAsc(discussion.created_at)
      .resultTypeNameAttr(userThreadInterface);

    this.selectItems = this.selectPosts
      .union(this.selectQuestions, true)
      .union(this.selectDiscussions, true)
      .orderByDesc(post.created_at)
      .resultTypeNameAttr(userThreadInterface);
  }

  private typeCol(itemType: number): mm.RawColumn {
    return new mm.RawColumn(
      mm.sql`${itemType.toString()}`,
      userThreadTypeColumnName,
      mm.int().__type,
    );
  }

  private getForumGroupCols(t: ForumGroup): mm.SelectedColumn[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.forum_count, t.desc];
  }

  private getForumCols(t: Forum): mm.SelectedColumn[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.thread_count, t.group_id];
  }
}

export default mm.tableActions(mm.table(Home), HomeTA);
