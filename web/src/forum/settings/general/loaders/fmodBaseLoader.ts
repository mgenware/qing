import Loader from 'lib/loader';

// Base loader type for all forum mod APIs.
export default class FModBaseLoader<T> extends Loader<T> {
  constructor(public forumID: string) {
    super();
  }

  requestParams(): Record<string, unknown> {
    return {
      forumID: this.forumID,
    };
  }
}
