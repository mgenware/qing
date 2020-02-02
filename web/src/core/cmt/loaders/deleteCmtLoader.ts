import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeleteCmtLoader extends BaseLoader<string> {
  constructor(public id: string | null) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.deleteCmt;
  }

  requestParams(): object {
    return {
      id: this.id,
    };
  }
}
