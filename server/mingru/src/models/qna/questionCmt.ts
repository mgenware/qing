/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import question from './question';

export class QuestionCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return question;
  }
}

export default mm.table(QuestionCmt);
