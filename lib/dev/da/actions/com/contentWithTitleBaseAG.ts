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

  override extendedCoreCols(): mm.Column[] {
    const t = this.baseTable();
    return [t.title];
  }
}
