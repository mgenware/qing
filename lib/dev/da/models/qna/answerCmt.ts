/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase.js';
import ContentCmtBase from '../com/contentCmtCore.js';
import answer from './answer.js';

export class AnswerCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return answer;
  }
}

export default mm.table(AnswerCmt);
