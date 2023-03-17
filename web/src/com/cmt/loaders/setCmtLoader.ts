/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as composeRoute from '@qing/routes/s/pri/compose.js';
import { ComposerContent } from 'ui/editing/composerView.js';
import { Cmt } from '../data/cmt.js';
import Entity from 'lib/entity.js';

// DON'T change the names below. They're used by server as well.
export interface SetCmtData {
  host: Entity;
  contentData: ComposerContent;
  // Only used when editing a cmt or reply.
  id?: string;
  // Only used when creating a reply.
  parentID?: string;
}

export interface SetCmtResponse {
  cmt: Cmt;
}

export class SetCmtLoader extends Loader<SetCmtResponse> {
  static newCmt(host: Entity, contentData: ComposerContent): SetCmtLoader {
    return new SetCmtLoader({
      host,
      contentData,
    });
  }

  static editCmt(host: Entity, id: string, contentData: ComposerContent): SetCmtLoader {
    return new SetCmtLoader({
      host,
      contentData,
      id,
    });
  }

  static newReply(host: Entity, parentID: string, contentData: ComposerContent): SetCmtLoader {
    return new SetCmtLoader({
      host,
      parentID,
      contentData,
    });
  }

  private constructor(public data: SetCmtData) {
    super();
  }

  override requestURL(): string {
    return composeRoute.setCmt;
  }

  override requestParams(): Record<string, unknown> {
    return { ...this.data };
  }
}
