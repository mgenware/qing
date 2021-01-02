import Loader from 'lib/loader';
import routes from 'routes';
import { ItemsResponse } from 'lib/itemCollector';
import Cmt from '../cmt';
import { CHECK } from 'checks';

export interface GetCmtsInputs {
  hostID: string;
  hostType: number;
  page: number;
}

export interface GetRepliesInputs {
  parentCmtID: string;
  page: number;
}

export default class GetCmtsLoader extends Loader<ItemsResponse<Cmt>> {
  cmtInputs?: GetCmtsInputs;
  replyInputs?: GetRepliesInputs;

  private constructor() {
    super();
  }

  static cmt(inputs: GetCmtsInputs): GetCmtsLoader {
    CHECK(inputs.hostID);
    CHECK(inputs.hostType);
    const res = new GetCmtsLoader();
    res.cmtInputs = inputs;
    return res;
  }

  static reply(inputs: GetRepliesInputs): GetCmtsLoader {
    CHECK(inputs.parentCmtID);
    const res = new GetCmtsLoader();
    res.replyInputs = inputs;
    return res;
  }

  requestURL(): string {
    return routes.s.pub.cmt.get;
  }

  requestParams(): Record<string, unknown> {
    if (this.cmtInputs) {
      return this.cmtInputs;
    }
    if (this.replyInputs) {
      return this.replyInputs;
    }
    return {};
  }
}
