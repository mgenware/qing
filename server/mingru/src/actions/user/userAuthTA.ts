/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userAuth';

export class UserAuthTA extends mm.TableActions {
  addUserAuth = mm.insertOne().setInputs();
}

export default mm.tableActions(t, UserAuthTA);
