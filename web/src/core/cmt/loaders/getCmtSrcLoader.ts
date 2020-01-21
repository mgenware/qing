import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetCmtSourceResult {
  content: string;
}

export class GetCmtSourceLoader extends BaseLoader<GetCmtSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.getCmtSource;
  }

  requestParams(): object {
    return {
      id: this.id,
    };
  }
}
