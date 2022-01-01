/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CHECK } from 'checks';
import Loader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';
import { Cmt } from '../data/cmt';

// DON'T change the names below. They're used by server as well.
export interface SetCmtData {
  // Always required.
  hostID: string;
  hostType: number;
  contentData: ComposerContent;
  // Only used when editing a cmt or reply.
  id?: string;
  isReply?: number;
  // Only used when creating a reply.
  toUserID?: string;
  parentCmtID?: string;
}

export interface SetCmtResponse {
  cmt: Cmt;
}

export class SetCmtLoader extends Loader<SetCmtResponse> {
  static newCmt(hostID: string, hostType: number, contentData: ComposerContent): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      contentData,
    });
  }

  static editCmt(
    hostID: string,
    hostType: number,
    id: string,
    isReply: boolean,
    contentData: ComposerContent,
  ): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      contentData,
      id,
      isReply: +isReply,
    });
  }

  static newReply(
    hostID: string,
    hostType: number,
    toUserID: string,
    parentCmtID: string,
    contentData: ComposerContent,
  ): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      toUserID,
      parentCmtID,
      contentData,
    });
  }

  private constructor(public data: SetCmtData) {
    super();

    CHECK(data.hostID);
    CHECK(data.hostType);
  }

  requestURL(): string {
    return routes.s.pri.compose.setCmt;
  }

  requestParams(): Record<string, unknown> {
    return { ...this.data };
  }
}
