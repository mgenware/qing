/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../../models/common.js';

export interface CmtHostTable extends TableWithIDAndUserID {
  cmt_count: mm.Column;
}

export const cmtInterface = 'CmtInterface';
export const cmtResultType = 'CmtData';
export const replyInterface = 'ReplyInterface';
export const hasLikedProp = 'hasLiked';
export const viewerUserIDInput = 'viewerUserID';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  host_id: mm.Column;
}
