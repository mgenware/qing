/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as entRoute from '@qing/routes/s/pub/ent.js';
import Entity from 'lib/entity.js';
import { Cmt } from '../data/cmt.js';
import { CHECK } from 'checks.js';
import { ItemsLoadedResp } from 'lib/itemCollector.js';

export interface GetCmtsInputs {
  host: Entity;
  page: number;
  excluded: string[] | null;
}

export interface GetRepliesInputs {
  parentID: string;
  page: number;
  excluded: string[] | null;
}

export default class GetCmtsLoader extends Loader<ItemsLoadedResp<Cmt>> {
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
    CHECK(inputs.parentID);
    const res = new GetCmtsLoader();
    res.replyInputs = inputs;
    return res;
  }

  override requestURL(): string {
    return entRoute.cmts;
  }

  override requestParams(): Record<string, unknown> {
    if (this.cmtInputs) {
      return { ...this.cmtInputs };
    }
    if (this.replyInputs) {
      return { ...this.replyInputs };
    }
    return {};
  }
}
