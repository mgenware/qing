import PaginatedList from 'lib/api/paginatedList';
import BaseLoader from 'lib/loader';
import routes from 'routes';
import { entityPost, entityDiscussion } from 'sharedConstants';

export interface DashboardPost {
  id: string;
  url: string;
  title: string;
  cmtCount: number;
  likes: number;
  createdAt: string;
  modifiedAt: string;
}

export interface DashboardDiscussion {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  msgCount: number;
}

export class GetMyPostsLoader<T> extends BaseLoader<PaginatedList<T>> {
  constructor(
    public entityType: number,
    public page: number,
    public pageSize: number,
    public sortedColumn: string,
    public desc: boolean,
  ) {
    super();
  }

  requestURL(): string {
    switch (this.entityType) {
      case entityPost:
        return routes.s.pri.mp.posts;

      case entityDiscussion:
        return routes.s.pri.mp.discussions;

      default:
        throw new Error(`Unsupported entity type ${this.entityType}`);
    }
  }

  requestParams(): unknown {
    return {
      page: this.page,
      pageSize: this.pageSize,
      sort: this.sortedColumn,
      desc: +this.desc,
    };
  }
}
