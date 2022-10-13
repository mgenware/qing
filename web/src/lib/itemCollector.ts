/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { KeyedObservableArray, ChangeInfo } from 'qing-keyed-array';
import Loader from './loader';
import LoadingStatus from './loadingStatus';

export enum ChangedByLoading {
  loadMore = 1,
  preload,
}

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
  changedByLoading?: ChangedByLoading;
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
      const changedByLoading = e.tag as ChangedByLoading | undefined;
      // Total count is not affected when `changedBy` is `loadMore` or `preload`.
      if (!changedByLoading) {
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
        changedByLoading,
      });
    };
  }

  async loadMoreAsync(excluded: string[] | null) {
    const loader = this.createLoader(excluded);
    loader.loadingStatusChanged = this.loadingStatusChanged;
    const payload = await loader.startAsync();

    const newItems = payload.items ?? [];

    this.hasNext = payload.hasNext ?? false;
    this.page += 1;
    // Set `tag` to true to indicate this change is triggered by
    // loading more items.
    // The `tag` gets reset after `changed` fires.
    this._observableItems.push(newItems, { tag: ChangedByLoading.loadMore });
  }

  preload(items: T[]) {
    this._observableItems.push(items, { tag: ChangedByLoading.preload });
  }

  // `excluded`: an array of item IDs to be excluded from result.
  // Used to filter out newly added (fresh) items.
  protected abstract createLoader(excluded: string[] | null): Loader<ItemsLoadedResp<T>>;
}
