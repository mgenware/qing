/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentWithTitleBase from '../../models/com/contentWithTitleBase.js';
import ContentBaseAG from '../com/contentBaseAG.js';

export default abstract class ContentWithTitleBaseAG<
  T extends ContentWithTitleBase,
> extends ContentBaseAG<T> {
  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [...super.colsOfSelectItemsForPostCenter(), t.title];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [...super.colsOfSelectItemsForUserProfile(), t.title];
  }

  protected override extraSelectItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraSelectItemCols(), t.title];
  }
  protected override extraSelectSrcItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraSelectSrcItemCols(), t.title];
  }
  protected override extraInsertItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraInsertItemCols(), t.title];
  }
  protected override extraUpdateItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraUpdateItemCols(), t.title];
  }
}
