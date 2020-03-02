import {
  ItemCollector,
  ItemsResponse,
  ItemsChangedEventArgs,
} from 'lib/itemCollector';
import Cmt from './cmt';
import Loader from 'lib/loader';
import { EntityType } from 'lib/entity';
import GetCmtsLoader from './loaders/getCmtsLoader';
import LoadingStatus from 'lib/loadingStatus';

export default class CmtCollector extends ItemCollector<Cmt> {
  constructor(
    public hostID: string,
    public hostType: EntityType,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEventArgs<Cmt>) => void,
  ) {
    super(loadingStatusChanged, itemsChanged);
  }

  protected createLoader(): Loader<ItemsResponse<Cmt>> {
    return new GetCmtsLoader(this.hostID, this.hostType, this.page);
  }

  protected getItemID(item: Cmt): string {
    return item.id;
  }
}
