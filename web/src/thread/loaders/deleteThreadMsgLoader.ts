import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeleteThreadMsgLoader extends BaseLoader<string> {
  constructor(public pid: string | null) {
    super();
  }

  requestURL(): string {
    return routes.s.r.thread.deleteThreadMsg;
  }

  requestParams(): unknown {
    return {
      id: this.pid,
    };
  }
}
