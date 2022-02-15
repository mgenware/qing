/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as composeRoute from 'routes/s/pri/compose';
import { entityDiscussionMsg, entityAnswer } from 'sharedConstants';
import { ComposerContent } from 'ui/editor/composerView';

export class SetEntityLoader extends Loader<string> {
  // Used when `entityType` is `discussionMsg`;
  discussionID?: string;
  // Used when `entityType` is `discussionAnswer`;
  questionID?: string;

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
    if (entityType === entityDiscussionMsg) {
      if (!this.discussionID) {
        throw new Error('`discussionID` is required when `entityType` is `entityDiscussionMsg`');
      }
      params.discussionID = this.discussionID;
    } else if (entityType === entityAnswer) {
      if (!this.questionID) {
        throw new Error('`questionID` is required when `entityType` is `entityAnswer`');
      }
      params.questionID = this.questionID;
    }
    if (this.forumID) {
      params.forumID = this.forumID;
    }
    return params;
  }
}
