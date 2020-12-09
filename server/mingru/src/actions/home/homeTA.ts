import * as mm from 'mingru-models';
import { BaseEntityTableWithIDAndTitle } from '../../models/common';
import post from '../../models/post/post';
import discussion from '../../models/discussion/discussion';
import user from '../../models/user/user';
import forumGroup, { ForumGroup } from '../../models/forum/forumGroup';
import forum, { Forum } from '../../models/forum/forum';

const itemTypeName = 'itemType';
const itemTypeInterface = 'HomeItemInterface';
enum HomeItemType {
  postItem = 1,
  discussionItem,
}

export class Home extends mm.GhostTable {}

export class HomeTA extends mm.TableActions {
  // Non-forum mode.
  selectPosts: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectItems: mm.SelectAction;

  // Forum mode.
  selectForumGroup = mm
    .selectRows(...this.getForumGroupCols(forumGroup))
    .from(forumGroup)
    .orderByDesc(forumGroup.order_index);
  selectForums = mm.selectRows(...this.getForumCols(forum)).from(forum).noOrderBy;

  constructor() {
    super();

    this.selectPosts = mm
      .selectPage(this.typeCol(HomeItemType.postItem), ...this.getDefaultItemCols(post))
      .from(post)
      .orderByAsc(post.created_at)
      .attr(mm.ActionAttributes.resultTypeName, itemTypeInterface);
    this.selectDiscussions = mm
      .selectPage(this.typeCol(HomeItemType.discussionItem), ...this.getDefaultItemCols(discussion))
      .from(discussion)
      .orderByAsc(discussion.created_at)
      .attr(mm.ActionAttributes.resultTypeName, itemTypeInterface);
    this.selectItems = this.selectPosts
      .union(this.selectDiscussions, true)
      .orderByDesc(post.created_at)
      .attr(mm.ActionAttributes.resultTypeName, itemTypeInterface);
  }

  private typeCol(itemType: HomeItemType): mm.RawColumn {
    return new mm.RawColumn(mm.sql`${itemType.toString()}`, itemTypeName, mm.int().__type);
  }

  private getDefaultItemCols(t: BaseEntityTableWithIDAndTitle): mm.SelectedColumn[] {
    const joinedUserTable = t.user_id.join(user);
    const privateCols = [
      t.id,
      t.user_id,
      joinedUserTable.name,
      joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());

    return [...privateCols, t.title, t.created_at, t.modified_at];
  }

  private getForumGroupCols(t: ForumGroup): mm.SelectedColumn[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.forum_count];
  }

  private getForumCols(t: Forum): mm.SelectedColumn[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.thread_count, t.group_id];
  }
}

export default mm.tableActions(mm.table(Home), HomeTA);
