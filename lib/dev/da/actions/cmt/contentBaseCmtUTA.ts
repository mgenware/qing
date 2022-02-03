/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import ContentBase from '../../models/com/contentBase.js';
import { getSelectCmtsAction } from '../cmt/cmtTAUtils.js';

class ContentBaseUtil extends ContentBase {}

const contentBaseUtil = mm.table(ContentBaseUtil);

class ContentBaseCmtUtil extends ContentBaseCmt {
  override getHostTable(): ContentBase {
    return contentBaseUtil;
  }
}

const contentBaseCmtUtil = mm.table(ContentBaseCmtUtil);

export class ContentBaseCmtUTA extends mm.TableActions {
  selectRootCmts: mm.SelectAction;

  constructor() {
    super();
    this.selectRootCmts = getSelectCmtsAction(contentBaseCmtUtil, false);
  }
}

export default mm.tableActions(contentBaseCmtUtil, ContentBaseCmtUTA, {
  configurableTable: true,
});
