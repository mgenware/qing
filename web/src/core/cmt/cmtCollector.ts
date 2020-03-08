import {
  ItemCollector,
  ItemsResponse,
  ItemsChangedEventArgs,
} from 'lib/itemCollector';
import Cmt from './cmt';
import Loader from 'lib/loader';
import GetCmtsLoader, {
  GetCmtsInputs,
  GetRepliesInputs,
} from './loaders/getCmtsLoader';
import LoadingStatus from 'lib/loadingStatus';

export default class CmtCollector extends ItemCollector<Cmt> {
  cmtInputs?: GetCmtsInputs;
  replyInputs?: GetRepliesInputs;

  constructor(
    cmtInputs: GetCmtsInputs | undefined,
    replyInputs: GetRepliesInputs | undefined,
    public loadingStatusChanged: (status: LoadingStatus) => void,
    public itemsChanged: (e: ItemsChangedEventArgs<Cmt>) => void,
  ) {
    super(loadingStatusChanged, itemsChanged);
    this.cmtInputs = cmtInputs;
    this.replyInputs = replyInputs;
  }

  protected createLoader(): Loader<ItemsResponse<Cmt>> {
    if (this.cmtInputs) {
      return GetCmtsLoader.cmt(this.cmtInputs);
    }
    if (this.replyInputs) {
      return GetCmtsLoader.reply(this.replyInputs);
    }
    throw new Error('Both `cmtInputs` and `replyInputs` are undefined.');
  }

  protected getItemID(item: Cmt): string {
    return item.id;
  }
}
