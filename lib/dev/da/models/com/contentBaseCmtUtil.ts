/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from './contentBaseCmt.js';
import contentBaseUtil from './contentBaseUtil.js';

export class ContentBaseCmtUtil extends ContentBaseCmt {
  override getCmtHostTable() {
    return contentBaseUtil;
  }
}

export default mm.table(ContentBaseCmtUtil, { virtualTable: true });
