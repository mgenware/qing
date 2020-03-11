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
  // Actual number of loaded items.
  actualCount: number;
  newItems: T[];
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
    public itemsChanged: (e: ItemsChangedEventArgs<T>) => void,
  ) {}

  async loadMoreAsync() {
    const loader = this.createLoader();
    loader.loadingStatusChanged = this.loadingStatusChanged;
    const payload = await loader.startAsync();

    const newItems = payload.items || [];
    this.addCore(newItems, true);

    this.hasNext = payload.hasNext || false;
    this.page += 1;

    this.onItemsChanged(newItems);
  }

  protected abstract createLoader(): Loader<ItemsResponse<T>>;
  protected abstract getItemID(item: T): string;

  deleteByIndex(idx: number) {
    const item = this.items[idx];
    if (!item) {
      return;
    }
    this.items = arrayUtils.removeByIndexReadOnly(this.items, idx);
    this.deleteMapItem(this.getItemID(item));
    this.count--;
    this.actualCount--;
    this.onItemsChanged([]);
  }

  getByKey(key: string): T | null {
    return this.itemMap[key];
  }

  prepend(newItems: T[]) {
    this.addCore(newItems, false);
    this.onItemsChanged(newItems);
  }

  append(newItems: T[]) {
    this.addCore(newItems, true);
    this.onItemsChanged(newItems);
  }

  private addCore(newItems: T[], append: boolean) {
    // Remove duplicates (items already added).
    newItems = newItems.filter(item => !this.itemMap[this.getItemID(item)]);
    const { items } = this;
    const count = newItems.length;
    for (const item of newItems) {
      this.itemMap[this.getItemID(item)] = item;
    }
    this.items = append ? [...items, ...newItems] : [...newItems, ...items];
    this.count += count;
    this.actualCount += count;
  }

  private deleteMapItem(key: string) {
    delete this.itemMap[key];
  }

  protected onItemsChanged(newItems: T[]) {
    this.itemsChanged({
      items: this.items,
      hasNext: this.hasNext,
      page: this.page,
      actualCount: this.actualCount,
      newItems,
    });
  }
}
