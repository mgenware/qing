/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appPageState from 'app/appPageState.js';

export interface ForumPageState {
  FID: string;
  Editable: boolean;
}

export default appPageState.extraData<ForumPageState>();
