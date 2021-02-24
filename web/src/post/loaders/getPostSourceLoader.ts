import Loader from 'lib/loader';
import routes from 'routes';

export interface GetPostSourceResult {
  title: string;
  contentHTML: string;
}

export class GetPostSourceLoader extends Loader<GetPostSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.getPostSource;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
    };
  }
}
