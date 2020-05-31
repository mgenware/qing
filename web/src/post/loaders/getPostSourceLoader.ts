import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetPostSourceResult {
  title: string;
  content: string;
}

export class GetPostSourceLoader extends BaseLoader<GetPostSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.getPostSource;
  }

  requestParams(): unknown {
    return {
      id: this.id,
    };
  }
}
