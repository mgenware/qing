import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeletePostLoader extends BaseLoader<string> {
  constructor(public pid: string | null) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.deletePost;
  }

  requestParams(): object {
    return {
      id: this.pid,
    };
  }
}
