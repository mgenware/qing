import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeletePostLoader extends BaseLoader {
  constructor(public pid: string | null) {
    super();
  }

  requestURL(): string {
    return routes.sr.compose.deletePost;
  }

  requestParams(): object {
    return {
      id: this.pid,
    };
  }
}
