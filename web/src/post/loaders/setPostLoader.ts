/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import { entityDiscussionMsg } from 'sharedConstants';
import { ComposerContent } from 'ui/editor/composerView';

export class SetPostLoader extends Loader<string> {
  // Used when `entityType` is `discussionMsg`;
  discussionID?: string;

  constructor(
    public id: string | null,
    public content: ComposerContent,
    public entityType: number,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.setPost;
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
    if (entityType === entityDiscussionMsg) {
      if (!this.discussionID) {
        throw new Error('`discussionID` is required when `entityType` is discussion msg');
      }
      params.discussionID = this.discussionID;
    }
    return params;
  }
}
