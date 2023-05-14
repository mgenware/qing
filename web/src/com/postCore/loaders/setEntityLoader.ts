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

export interface SetEntityLoaderArgs {
  /// These field names are locked with server API param names.
  id?: string;
  content: ComposerContent;
  entityType: number;
  forumID?: string;
  summary?: string;
  contentSrc?: string;
}

export class SetEntityLoader extends Loader<string | null> {
  constructor(public args: SetEntityLoaderArgs) {
    super();
    if (appPageState.forums && !args.forumID) {
      throw new Error('`forumID` is required in forums mode');
    }
  }

  override requestURL(): string {
    return composeRoute.setEntity;
  }

  override requestParams(): Record<string, unknown> {
    return this.args as unknown as Record<string, unknown>;
  }
}
