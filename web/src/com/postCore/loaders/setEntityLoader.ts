/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as composeRoute from '@qing/routes/d/s/pri/compose';
import { appdef } from '@qing/def';
import { ComposerContent } from 'ui/editing/composerView';
import appPageState from 'app/appPageState';

export class SetEntityLoader extends Loader<string | null> {
  constructor(
    public id: string | null,
    public content: ComposerContent,
    public entityType: number,
    public forumID: string | null,
  ) {
    super();
    if (appPageState.appMode === appdef.appModeForums && !forumID) {
      throw new Error('`forumID` is required in forum mode');
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
