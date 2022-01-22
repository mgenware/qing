/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import { Cmt } from '../data/cmt';
import { CHECK } from 'checks';
import { ItemsLoadedResp } from 'lib/itemCollector';

export interface GetCmtsInputs {
  hostID: string;
  hostType: number;
  page: number;
}

export interface GetRepliesInputs {
  parentID: string;
  page: number;
}

export default class GetCmtsLoader extends Loader<ItemsLoadedResp<Cmt>> {
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
    CHECK(inputs.parentID);
    const res = new GetCmtsLoader();
    res.replyInputs = inputs;
    return res;
  }

  requestURL(): string {
    return routes.s.pub.cmt.get;
  }

  requestParams(): Record<string, unknown> {
    if (this.cmtInputs) {
      return { ...this.cmtInputs };
    }
    if (this.replyInputs) {
      return { ...this.replyInputs };
    }
    return {};
  }
}
