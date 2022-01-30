/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { KeyedObservableArray, ChangeInfo } from 'qing-keyed-array';
import Loader from './loader';
import LoadingStatus from './loadingStatus';

export interface ItemsLoadedResp<T> {
  items?: ReadonlyArray<T>;
  hasNext?: boolean;
}

export interface ItemsChangedEvent<T> {
  items: readonly T[];
  hasNext: boolean;
  changed: number;
  totalCount: number;
  detail: ChangeInfo<string>;
  sender: ItemCollector<T>;
  // This change was triggered by loading more items.
  triggeredByLoading: boolean;
}

export abstract class ItemCollector<T> {
  // Keeps track of all IDs. When adding an item, instead of reloading the
  // whole thing, the new item is constructed locally and added to items
  // directly. Later when user scrolls down to load more items from server,
  // the same item from server could get added again. `itemMap` can help detect
  // duplicates and prevent this from happening.
  private _observableItems: KeyedObservableArray<string, T>;

  page = 1;
  hasNext = false;
  totalCount: number;

  get count(): number {
    return this._observableItems.count;
  }

  get observableItems() {
    return this._observableItems;
  }

  constructor(
    initialTotalCount: number,
    public keyFn: (item: T) => string,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEvent<T>) => void,
  ) {
    this.totalCount = initialTotalCount;
    this.hasNext = !!initialTotalCount;
    this._observableItems = new KeyedObservableArray<string, T>(true, keyFn);
    this._observableItems.changed = (sender, e) => {
      const triggeredByLoading = !!e.tag;
      if (!triggeredByLoading) {
        this.totalCount += e.countDelta;
      }
      const { hasNext, totalCount } = this;
      itemsChanged({
        items: sender.array,
        hasNext,
        totalCount,
        changed: e.numberOfChanges,
        detail: e,
        sender: this,
        triggeredByLoading,
      });
    };
  }

  async loadMoreAsync() {
    const loader = this.createLoader();
    loader.loadingStatusChanged = this.loadingStatusChanged;
    const payload = await loader.startAsync();

    const newItems = payload.items ?? [];

    this.hasNext = payload.hasNext ?? false;
    this.page += 1;
    // Set `tag` to true to indicate this change is triggered by
    // loading more items.
    // The `tag` gets reset after `changed` fires.
    this._observableItems.tag = true;
    this._observableItems.push(...newItems);
  }

  protected abstract createLoader(): Loader<ItemsLoadedResp<T>>;
}
