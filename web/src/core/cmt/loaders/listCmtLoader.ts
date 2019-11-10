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
    public eid: string,
    public eType: EntityType,
    public page?: number,
  ) {
    super();
  }

  requestURL(): string {
    return routes.sp.cmt.list;
  }

  requestParams(): object {
    const ret = {
      eid: this.eid,
      etype: this.eType,
      page: this.page,
    };
    return ret;
  }
}
