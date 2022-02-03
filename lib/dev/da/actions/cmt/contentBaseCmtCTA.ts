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

class VContentBase extends ContentBase {}

const vContentBase = mm.table(VContentBase);

export class VContentBaseCmt extends ContentBaseCmt {
  override getHostTable(): ContentBase {
    return vContentBase;
  }
}

const vContentBaseCmt = mm.table(VContentBaseCmt);

export class ContentBaseCmtCTA extends mm.TableActions {
  selectRootCmts: mm.SelectAction;

  constructor() {
    super();
    this.selectRootCmts = getSelectCmtsAction(vContentBaseCmt, false);
  }
}

export default mm.tableActions(vContentBaseCmt, ContentBaseCmtCTA, { configurableTable: true });
