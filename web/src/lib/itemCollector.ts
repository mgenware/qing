import Loader from './loader';
import * as arrayUtils from 'lib/arrayUtils';
import LoadingStatus from './loadingStatus';

export interface ItemsResponse<T> {
  items?: T[];
  hasNext?: boolean;
}

export interface ItemsChangedEventArgs<T> {
  items: T[];
  hasNext: boolean;
  page: number;
  // Total amount of items.
  count: number;
  // Actual number of loaded items.
  actualCount: number;
}

export abstract class ItemCollector<T> {
  // Keeps track of all IDs. When adding an item, instead of reloading the
  // whole thing, the new item is constructed locally and added to items
  // directly. Later when user scrolls down to load more items from server,
  // the same item from server could get added again. `itemMap` can help detect
  // duplicates and prevent this from happening.
  protected itemMap: { [key: string]: T } = {};

  protected items: T[] = [];
  protected page = 1;
  protected hasNext = false;
  protected count = 0;
  protected actualCount = 0;

  constructor(
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: Partial<ItemsChangedEventArgs<T>>) => void,
  ) {}

  async loadMoreAsync() {
    const loader = this.createLoader();
    loader.loadingStatusChanged = this.loadingStatusChanged;
    const payload = await loader.startAsync();

    const newItems = payload.items || [];
    for (const item of newItems) {
      this.addCore(item);
    }

    this.hasNext = payload.hasNext || false;
    this.page += 1;

    this.onItemsChanged({
      items: this.items,
      hasNext: this.hasNext,
      page: this.page,
      count: this.count,
      actualCount: this.actualCount,
    });
  }

  protected abstract createLoader(): Loader<ItemsResponse<T>>;
  protected abstract getItemID(item: T): string;

  deleteByIndex(idx: number) {
    const item = this.items[idx];
    arrayUtils.removeByIndex(this.items, idx);
    this.deleteMapItem(this.getItemID(item));
  }

  getByKey(key: string): T | null {
    return this.itemMap[key];
  }

  add(item: T) {
    if (this.addCore(item)) {
      this.onItemsChanged({
        items: this.items,
        count: this.count,
        actualCount: this.actualCount,
      });
    }
  }

  private addCore(item: T): boolean {
    const id = this.getItemID(item);
    if (this.itemMap[id]) {
      return false;
    }
    this.itemMap[id] = item;
    this.items.push(item);
    this.count += 1;
    this.actualCount += 1;
    return true;
  }

  private deleteMapItem(key: string) {
    delete this.itemMap[key];
  }

  protected onItemsChanged(e: Partial<ItemsChangedEventArgs<T>>) {
    this.itemsChanged(e);
  }
}
