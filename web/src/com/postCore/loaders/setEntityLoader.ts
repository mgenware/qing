/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as composeRoute from '@qing/routes/d/s/pri/compose';
import { appdef } from '@qing/def';
import { ComposerContent } from 'ui/editor/composerView';

export class SetEntityLoader extends Loader<string> {
  // Used when `entityType` is `thread`;
  threadID?: string;

  constructor(
    public id: string | null,
    public content: ComposerContent,
    public entityType: number,
    public forumID: string,
  ) {
    super();
  }

  requestURL(): string {
    return composeRoute.setEntity;
  }

  requestParams(): Record<string, unknown> {
    const { entityType } = this;
    const params: Record<string, unknown> = {
      content: this.content,
      entityType,
    };
    if (this.id) {
      params.id = this.id;
    }
    if (entityType === appdef.contentBaseTypeThread) {
      if (!this.threadID) {
        throw new Error('`discussionID` is required when `entityType` is `entityDiscussionMsg`');
      }
      params.threadID = this.threadID;
    }
    if (this.forumID) {
      params.forumID = this.forumID;
    }
    return params;
  }
}
