import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetThreadSourceResult {
  title: string;
  content: string;
}

export class GetThreadSourceLoader extends BaseLoader<GetThreadSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.thread.getThreadSource;
  }

  requestParams(): unknown {
    return {
      id: this.id,
    };
  }
}
