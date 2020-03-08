import Loader from 'lib/loader';
import routes from 'routes';
import { EntityType } from 'lib/entity';
import { ItemsResponse } from 'lib/itemCollector';
import Cmt from '../cmt';

export interface GetCmtsInputs {
  hostID: string;
  hostType: EntityType;
  page: number;
}

export interface GetRepliesInputs {
  parentID: string;
  page: number;
}

export default class GetCmtsLoader extends Loader<ItemsResponse<Cmt>> {
  cmtInputs?: GetCmtsInputs;
  replyInputs?: GetRepliesInputs;

  private constructor() {
    super();
  }

  static cmt(inputs: GetCmtsInputs): GetCmtsLoader {
    const res = new GetCmtsLoader();
    res.cmtInputs = inputs;
    return res;
  }

  static reply(inputs: GetRepliesInputs): GetCmtsLoader {
    const res = new GetCmtsLoader();
    res.replyInputs = inputs;
    return res;
  }

  requestURL(): string {
    return routes.s.p.cmt.get;
  }

  requestParams(): object {
    if (this.cmtInputs) {
      return this.cmtInputs;
    }
    if (this.replyInputs) {
      return this.replyInputs;
    }
    return {};
  }
}
