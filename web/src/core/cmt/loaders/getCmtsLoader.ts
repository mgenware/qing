import Loader from 'lib/loader';
import routes from 'routes';
import { EntityType } from 'lib/entity';
import { ItemsResponse } from 'lib/itemCollector';
import Cmt from '../cmt';

export default class GetCmtsLoader extends Loader<ItemsResponse<Cmt>> {
  private constructor(
    public hostID: string | null,
    public hostType: EntityType | null,
    public parentID: string | null,
    public page: number,
  ) {
    super();
  }

  static cmts(
    hostID: string,
    hostType: EntityType,
    page: number,
  ): GetCmtsLoader {
    return new GetCmtsLoader(hostID, hostType, null, page);
  }

  static replies(parentID: string, page: number): GetCmtsLoader {
    return new GetCmtsLoader(null, null, parentID, page);
  }

  requestURL(): string {
    return routes.s.p.cmt.get;
  }

  requestParams(): object {
    const ret = {
      hostID: this.hostID,
      hostType: this.hostType,
      page: this.page,
    };
    return ret;
  }
}
