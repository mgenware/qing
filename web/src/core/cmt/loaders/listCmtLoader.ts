import Loader from 'lib/loader';
import routes from 'routes';
import { EntityType } from 'lib/entity';
import Cmt from '../cmt';

export interface ListCmtLoaderResp {
  hasNext: boolean;
  cmts: Cmt[];
}

export default class ListCmtLoader extends Loader<ListCmtLoaderResp> {
  constructor(
    public entityID: string,
    public entityType: EntityType,
    public page?: number,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.p.cmt.list;
  }

  requestParams(): object {
    const ret = {
      entityID: this.entityID,
      entityType: this.entityType,
      page: this.page,
    };
    return ret;
  }
}
