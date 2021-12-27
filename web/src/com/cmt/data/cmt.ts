/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Cmt as CmtCore, Reply as ReplyCore } from 'sod/cmt/cmt';

interface UICmtCore {
  uiHighlighted?: boolean;
}

export interface Cmt extends CmtCore, UICmtCore {}

export interface Reply extends ReplyCore, UICmtCore {}

export default Cmt;

export interface CmtCountChangedEventDetail {
  // The number of items after change.
  count: number;
  // The number of changed items.
  offset: number;
}

export function isCmtReply(cmt: Cmt): boolean {
  return !!(cmt as Reply).toUserURL;
}

export function toReply(cmt: Cmt): Reply | null {
  if (isCmtReply(cmt)) {
    return cmt as Reply;
  }
  return null;
}
