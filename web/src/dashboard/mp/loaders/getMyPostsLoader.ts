import PaginatedList from 'lib/api/paginatedList';
import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface DashboardPost {
  id: string;
  url: string;
  title: string;
  cmtCount: number;
  likes: number;
  createdAt: string;
  modifiedAt: string;
}

export class GetMyPostsLoader extends BaseLoader<PaginatedList<DashboardPost>> {
  constructor(
    public page: number,
    public pageSize: number,
    public sortedColumn: string,
    public desc: boolean,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.r.mp.getPosts;
  }

  requestParams(): unknown {
    const ret = {
      page: this.page,
      pageSize: this.pageSize,
      sort: this.sortedColumn,
      desc: +this.desc,
    };
    return ret;
  }
}
