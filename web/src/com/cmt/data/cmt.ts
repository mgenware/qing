/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Cmt as CmtCore } from 'sod/cmt.js';

interface UICmtCore {
  uiHighlighted?: boolean;
}

export interface Cmt extends CmtCore, UICmtCore {}

export default Cmt;

export interface CmtCountChangedEventDetail {
  // The number of items after change.
  count: number;
  // The number of changed items.
  offset: number;
}

export function isCmtReply(cmt: Cmt): boolean {
  return !!cmt.parentID;
}
