/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ThreadBase from './threadBase.js';

export class ThreadBaseUtil extends ThreadBase {}

export default mm.table(ThreadBaseUtil, { virtualTable: true });
