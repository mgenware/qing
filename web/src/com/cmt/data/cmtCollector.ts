/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Entity from 'lib/entity';
import { ItemCollector, ItemsChangedEvent, ItemsLoadedResp } from 'lib/itemCollector';
import Loader from 'lib/loader';
import LoadingStatus from 'lib/loadingStatus';
import GetCmtsLoader from '../loaders/getCmtsLoader';
import { Cmt } from './cmt';

export default class CmtCollector extends ItemCollector<Cmt> {
  private constructor(
    initialTotalCount: number,
    // Used when getting cmts.
    public host: Entity | undefined,
    // Used when getting replies.
    public parentID: string | undefined,
    loadingStatusChanged: (status: LoadingStatus) => void,
    itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    super(initialTotalCount, (it) => it.id, loadingStatusChanged, itemsChanged);
  }

  static rootCmts(
    entity: Entity | undefined,
    loadingStatusChanged: (status: LoadingStatus) => void,
    itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    // Total count is useless when collecting root cmts.
    return new CmtCollector(0, entity, undefined, loadingStatusChanged, itemsChanged);
  }

  static replies(
    initialTotalCount: number,
    parentID: string | undefined,
    loadingStatusChanged: (status: LoadingStatus) => void,
    itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    return new CmtCollector(
      initialTotalCount,
      undefined,
      parentID,
      loadingStatusChanged,
      itemsChanged,
    );
  }

  protected override createLoader(excluded: string[] | null): Loader<ItemsLoadedResp<Cmt>> {
    if (this.host) {
      return GetCmtsLoader.cmt({
        host: this.host,
        page: this.page,
        excluded,
      });
    }
    if (this.parentID) {
      return GetCmtsLoader.reply({
        parentID: this.parentID,
        page: this.page,
        excluded,
      });
    }
    throw new Error('Both `host` and `parentID` are undefined.');
  }
}
