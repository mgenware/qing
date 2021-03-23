/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import KeyedArray, { ArrayChangedEvent } from 'qing-keyed-array';
import Loader from './loader';
import LoadingStatus from './loadingStatus';

export interface ItemsLoadedResp<T> {
  items?: ReadonlyArray<T>;
  hasNext?: boolean;
}

export interface ItemsChangedEvent<T> {
  items: ReadonlyArray<T>;
  hasNext: boolean;
  changed: number;
  totalCount: number;
  detail: ArrayChangedEvent<string>;
  sender: ItemCollector<T>;
}

export abstract class ItemCollector<T> {
  // Keeps track of all IDs. When adding an item, instead of reloading the
  // whole thing, the new item is constructed locally and added to items
  // directly. Later when user scrolls down to load more items from server,
  // the same item from server could get added again. `itemMap` can help detect
  // duplicates and prevent this from happening.
  items: KeyedArray<string, T>;

  page = 1;
  hasNext = false;
  totalCount: number;

  get count(): number {
    return this.items.count;
  }

  constructor(
    initialTotalCount: number,
    public keyFn: (item: T) => string,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEvent<T>) => void,
  ) {
    this.totalCount = initialTotalCount;
    this.items = new KeyedArray<string, T>(true, keyFn);
    this.items.onArrayChanged = (_, e) => {
      this.totalCount += e.numberOfChanges;
      const { items, hasNext, totalCount } = this;
      itemsChanged({
        items: items.array,
        hasNext,
        totalCount,
        changed: e.numberOfChanges,
        detail: e,
        sender: this,
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
    this.items.push(...newItems);
  }

  protected abstract createLoader(): Loader<ItemsLoadedResp<T>>;
}
