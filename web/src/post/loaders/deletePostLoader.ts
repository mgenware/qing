import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeletePostLoader extends BaseLoader<string> {
  constructor(public pid: string | null, public entityType: number) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.deletePost;
  }

  requestParams(): unknown {
    return {
      id: this.pid,
      entityType: this.entityType,
    };
  }
}
