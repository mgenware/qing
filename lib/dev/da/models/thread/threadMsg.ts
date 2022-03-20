/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import thread from './thread.js';
import ContentBase from '../com/contentBase.js';

export class ThreadMsg extends ContentBase {
  thread_id = thread.id;
}

export default mm.table(ThreadMsg);
