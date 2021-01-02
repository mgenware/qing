import Loader from 'lib/loader';
import routes from 'routes';

export default class DeletePostLoader extends Loader<string> {
  constructor(public pid: string | null, public entityType: number) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.deletePost;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.pid,
      entityType: this.entityType,
    };
  }
}
