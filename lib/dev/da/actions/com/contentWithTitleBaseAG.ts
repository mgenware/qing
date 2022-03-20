/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/post/post.js';
import ContentBaseAG from '../com/contentBaseAG.js';

export default abstract class ContentWithTitleBaseAG extends ContentBaseAG {
  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.title];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.title];
  }

  override colsOfSelectItemSrc(): mm.Column[] {
    return [t.title];
  }

  override selectItemCols(): mm.SelectedColumnTypes[] {
    return [...super.selectItemCols(), t.title];
  }
}
