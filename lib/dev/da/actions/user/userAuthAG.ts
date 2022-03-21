/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userAuth.js';

export class UserAuthAG extends mm.ActionGroup {
  addUserAuth = mm.insertOne().setParams();
}

export default mm.actionGroup(t, UserAuthAG);
