import { ItemCollector, ItemsResponse, ItemsChangedEventArgs } from 'lib/itemCollector';
import Loader from 'lib/loader';
import LoadingStatus from 'lib/loadingStatus';
import GetCmtsLoader, { GetCmtsInputs, GetRepliesInputs } from './loaders/getCmtsLoader';
import Cmt from './cmt';

// `page` param is managed internally by `CmtCollector`.
export type GetCmtsInputsWithoutPage = Exclude<GetCmtsInputs, 'page'>;
export type GetRepliesInputsWithoutPage = Exclude<GetRepliesInputs, 'page'>;

export default class CmtCollector extends ItemCollector<Cmt> {
  constructor(
    public cmtInputs: GetCmtsInputsWithoutPage | undefined,
    public replyInputs: GetRepliesInputsWithoutPage | undefined,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEventArgs<Cmt>) => void,
  ) {
    super(loadingStatusChanged, itemsChanged);
  }

  protected createLoader(): Loader<ItemsResponse<Cmt>> {
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

  protected getItemID(item: Cmt): string {
    return item.id;
  }
}
