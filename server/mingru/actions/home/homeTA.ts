import * as mm from 'mingru-models';
import { BaseEntityTableWithIDAndTitle } from '../../models/common';
import post from '../../models/post/post';
import thread from '../../models/thread/thread';
import user from '../../models/user/user';

const entityTypeName = 'entityType';
enum HomeItemType {
  postItem,
  threadItem,
}

export class HomeTable extends mm.GhostTable {}

export class HomeTA extends mm.TableActions {
  private selectPosts: mm.SelectAction;
  private selectThreads: mm.SelectAction;
  selectItems: mm.SelectAction;

  constructor() {
    super();

    this.selectPosts = mm
      .selectPage(this.typeCol(HomeItemType.postItem), ...this.getDefaultCols(post))
      .from(post)
      .orderByAsc(post.created_at)
      .privateAttr();
    this.selectThreads = mm
      .selectPage(this.typeCol(HomeItemType.threadItem), ...this.getDefaultCols(thread))
      .from(thread)
      .orderByAsc(post.created_at)
      .privateAttr();
    this.selectItems = this.selectPosts.union(this.selectThreads);
  }

  private typeCol(itemType: HomeItemType): mm.RawColumn {
    return new mm.RawColumn(mm.sql`${itemType.toString()}`, entityTypeName, mm.int().__type);
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
