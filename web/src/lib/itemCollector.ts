import KeyedArray from 'qing-keyed-array';
import Loader from './loader';
import LoadingStatus from './loadingStatus';

export interface ItemsLoadedDetail<T> {
  items?: T[];
  hasNext?: boolean;
}

export abstract class ItemCollector<T> {
  // Keeps track of all IDs. When adding an item, instead of reloading the
  // whole thing, the new item is constructed locally and added to items
  // directly. Later when user scrolls down to load more items from server,
  // the same item from server could get added again. `itemMap` can help detect
  // duplicates and prevent this from happening.
  items: KeyedArray<string, T>;

  protected page = 1;
  protected hasNext = false;
  protected count = 0;

  constructor(
    public keyFn: (item: T) => string,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsLoaded: (e: ItemsLoadedDetail<T>) => void,
    public itemsChanged: () => void,
  ) {
    this.items = new KeyedArray<string, T>(true, keyFn);
    this.items.onArrayChanged = itemsChanged;
  }

  async loadMoreAsync() {
    const loader = this.createLoader();
    loader.loadingStatusChanged = this.loadingStatusChanged;
    const payload = await loader.startAsync();

    const newItems = payload.items ?? [];

    this.hasNext = payload.hasNext ?? false;
    this.page += 1;
    this.items.push(...newItems);

    this.itemsLoaded({
      items: newItems,
      hasNext: this.hasNext,
    });
  }

  protected abstract createLoader(): Loader<ItemsLoadedDetail<T>>;
}
