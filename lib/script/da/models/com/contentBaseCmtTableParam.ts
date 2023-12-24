/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from './contentBaseCmt.js';
import contentBaseTableParam from './contentBaseTableParam.js';

export class ContentBaseCmtTableParam extends ContentBaseCmt {
  override getCmtHostTable() {
    return contentBaseTableParam;
  }
}

export default mm.table(ContentBaseCmtTableParam, { tableParam: true });
