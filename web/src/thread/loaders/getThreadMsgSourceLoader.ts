import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetThreadSourceResult {
  content: string;
}

export class GetThreadMsgSourceLoader extends BaseLoader<GetThreadSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.thread.getThreadMsgSource;
  }

  requestParams(): unknown {
    return {
      id: this.id,
    };
  }
}
