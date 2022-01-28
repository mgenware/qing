/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ItemCollector, ItemsChangedEvent, ItemsLoadedResp } from 'lib/itemCollector';
import Loader from 'lib/loader';
import LoadingStatus from 'lib/loadingStatus';
import GetCmtsLoader, { GetCmtsInputs, GetRepliesInputs } from '../loaders/getCmtsLoader';
import { Cmt } from './cmt';

// `page` param is managed internally by `CmtCollector`.
export type GetCmtsInputsWithoutPage = Exclude<GetCmtsInputs, 'page'>;
export type GetRepliesInputsWithoutPage = Exclude<GetRepliesInputs, 'page'>;

export default class CmtCollector extends ItemCollector<Cmt> {
  private constructor(
    initialTotalCount: number,
    public cmtInputs: GetCmtsInputsWithoutPage | undefined,
    public replyInputs: GetRepliesInputsWithoutPage | undefined,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    super(initialTotalCount, (it) => it.id, loadingStatusChanged, itemsChanged);
  }

  static rootCmts(
    cmtInputs: GetCmtsInputsWithoutPage,
    loadingStatusChanged: (status: LoadingStatus) => void,
    itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    // Total count is useless when collecting root cmts.
    return new CmtCollector(0, cmtInputs, undefined, loadingStatusChanged, itemsChanged);
  }

  static replies(
    initialTotalCount: number,
    replyInputs: GetRepliesInputsWithoutPage,
    loadingStatusChanged: (status: LoadingStatus) => void,
    itemsChanged: (e: ItemsChangedEvent<Cmt>) => void,
  ) {
    return new CmtCollector(
      initialTotalCount,
      undefined,
      replyInputs,
      loadingStatusChanged,
      itemsChanged,
    );
  }

  protected createLoader(): Loader<ItemsLoadedResp<Cmt>> {
    if (this.cmtInputs) {
      return GetCmtsLoader.cmt({
        ...this.cmtInputs,
        page: this.page,
      });
    }
    if (this.replyInputs) {
      return GetCmtsLoader.reply({
        ...this.replyInputs,
        page: this.page,
      });
    }
    throw new Error('Both `cmtInputs` and `replyInputs` are undefined.');
  }
}
