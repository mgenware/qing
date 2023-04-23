/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as composeRoute from '@qing/routes/s/pri/compose.js';
import { ComposerContent } from 'ui/editing/composerView.js';
import appPageState from 'app/appPageState.js';

export class SetEntityLoader extends Loader<string | null> {
  constructor(
    public id: string | null,
    public content: ComposerContent,
    public entityType: number,
    public forumID: string | null,
  ) {
    super();
    if (appPageState.forums && !forumID) {
      throw new Error('`forumID` is required in forums mode');
    }
  }

  override requestURL(): string {
    return composeRoute.setEntity;
  }

  override requestParams(): Record<string, unknown> {
    const { entityType } = this;
    const params: Record<string, unknown> = {
      content: this.content,
      entityType,
    };
    if (this.id) {
      params.id = this.id;
    }
    if (this.forumID) {
      params.forumID = this.forumID;
    }
    return params;
  }
}
