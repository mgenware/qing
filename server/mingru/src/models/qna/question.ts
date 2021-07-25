/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ThreadBase from '../com/threadBase.js';

export class Question extends ThreadBase {
  likes = mm.uInt().default(0);
}

export default mm.table(Question);
