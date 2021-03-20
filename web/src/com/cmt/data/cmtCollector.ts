import { ItemCollector, ItemsLoadedResponse } from 'lib/itemCollector';
import Loader from 'lib/loader';
import LoadingStatus from 'lib/loadingStatus';
import GetCmtsLoader, { GetCmtsInputs, GetRepliesInputs } from '../loaders/getCmtsLoader';
import Cmt from './cmt';

// `page` param is managed internally by `CmtCollector`.
export type GetCmtsInputsWithoutPage = Exclude<GetCmtsInputs, 'page'>;
export type GetRepliesInputsWithoutPage = Exclude<GetRepliesInputs, 'page'>;

export default class CmtCollector extends ItemCollector<Cmt> {
  constructor(
    public cmtInputs: GetCmtsInputsWithoutPage | undefined,
    public replyInputs: GetRepliesInputsWithoutPage | undefined,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsLoadedResponse<Cmt>) => void,
  ) {
    super((it) => it.id, loadingStatusChanged, itemsChanged);
  }

  protected createLoader(): Loader<ItemsLoadedResponse<Cmt>> {
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
