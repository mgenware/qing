import { CHECK } from 'checks';
import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class DeleteCmtLoader extends BaseLoader<string> {
  constructor(
    public id: string | null,
    public hostType: number,
    public hostID: string,
    public isReply: boolean,
  ) {
    super();
    CHECK(hostID);
    CHECK(hostType);
  }

  requestURL(): string {
    return routes.s.pri.compose.deleteCmt;
  }

  requestParams(): unknown {
    return {
      id: this.id,
      hostType: this.hostType,
      hostID: this.hostID,
      isReply: +this.isReply,
    };
  }
}
