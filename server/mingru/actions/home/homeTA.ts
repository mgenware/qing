import * as mm from 'mingru-models';
import { BaseEntityTableWithIDAndTitle } from '../../models/common';
import post from '../../models/post/post';
import discussion from '../../models/discussion/discussion';
import user from '../../models/user/user';

const itemTypeName = 'itemType';
const itemTypeInterface = 'HomeItemInterface';
enum HomeItemType {
  postItem = 1,
  discussionItem,
}

export class HomeTable extends mm.GhostTable {}

export class HomeTA extends mm.TableActions {
  selectPosts: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectItems: mm.SelectAction;

  constructor() {
    super();

    this.selectPosts = mm
      .selectPage(this.typeCol(HomeItemType.postItem), ...this.getDefaultCols(post))
      .from(post)
      .orderByAsc(post.created_at)
      .attr(mm.ActionAttributes.resultTypeName, itemTypeInterface);
    this.selectDiscussions = mm
      .selectPage(this.typeCol(HomeItemType.discussionItem), ...this.getDefaultCols(discussion))
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

  private getDefaultCols(t: BaseEntityTableWithIDAndTitle): mm.SelectActionColumns[] {
    const joinedUserTable = t.user_id.join(user);
    const privateCols = [
      t.id,
      t.user_id,
      joinedUserTable.name,
      joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());

    return [...privateCols, t.title, t.created_at, t.modified_at];
  }
}

export default mm.tableActions(mm.table(HomeTable), HomeTA);