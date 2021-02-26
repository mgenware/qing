import Loader from 'lib/loader';
import routes from 'routes';

export interface GetCmtSourceResult {
  contentHTML: string;
}

export class GetCmtSourceLoader extends Loader<GetCmtSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.getCmtSource;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
    };
  }
}
