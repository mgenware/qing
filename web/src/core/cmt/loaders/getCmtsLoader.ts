import Loader from 'lib/loader';
import routes from 'routes';
import { EntityType } from 'lib/entity';
import { ItemsResponse } from 'lib/itemCollector';
import Cmt from '../cmt';

export default class GetCmtsLoader extends Loader<ItemsResponse<Cmt>> {
  constructor(
    public hostID: string,
    public hostType: EntityType,
    public page: number,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.p.cmt.list;
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
