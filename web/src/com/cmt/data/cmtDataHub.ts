import { EventEmitter } from 'lib/eventEmitter';
import { ItemsChangedEventArgs } from 'lib/itemCollector';
import LoadingStatus from 'lib/loadingStatus';
import Cmt from './cmt';
import CmtCollector from './cmtCollector';

const rootLoadingStatusChanged = 'rootLoadingStatusChanged';
const rootItemsChanged = 'rootItemsChanged';
const childLoadingStatusChanged = 'childLoadingStatusChanged';
const childItemsChanged = 'childItemsChanged';
const openEditorRequested = 'openEditorRequested';
const cmtUpdated = 'cmtUpdated';
const startPage = 1;

export interface OpenCmtEditorRequest {
  open: boolean;

  // If not null, we're editing a comment or reply.
  current?: Cmt;
  // If not null, we're adding or editing a reply.
  parent?: Cmt;
  // When you reply another reply, `parent` is their parent, but
  // `replyingTo` would be the reply you're replying to.
  replyingTo?: Cmt;

  submitButtonText?: string;
}

export class CmtDataHub {
  // Collects all root-level comments.
  private rootCollector: CmtCollector;
  // K: root comment ID. V: reply collector of comment K.
  private replyCollectors: Record<string, CmtCollector> = {};

  private events = new EventEmitter();

  constructor(public hostID: string, public hostType: number) {
    const { events } = this;
    this.rootCollector = new CmtCollector(
      {
        hostID,
        hostType,
        page: startPage,
      },
      undefined,
      (status) => events.emit(rootLoadingStatusChanged, status),
      (e) => events.emit(rootItemsChanged, e),
    );
  }

  onRootLoadingStatusChanged(cb: (status: LoadingStatus) => void) {
    this.events.addListener(rootLoadingStatusChanged, (arg) => cb(arg as LoadingStatus));
  }

  onRootItemsChanged(cb: (e: ItemsChangedEventArgs<Cmt>) => void) {
    this.events.addListener(rootItemsChanged, (arg) => cb(arg as ItemsChangedEventArgs<Cmt>));
  }

  onChildLoadingStatusChanged(cmtID: string, cb: (e: LoadingStatus) => void) {
    this.events.addListener(childLoadingStatusChanged, (arg) => {
      const typedArgs = arg as [Cmt, LoadingStatus];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
  }

  onChildItemsChanged(cmtID: string, cb: (e: ItemsChangedEventArgs<Cmt>) => void) {
    this.events.addListener(childItemsChanged, (arg) => {
      const typedArgs = arg as [Cmt, ItemsChangedEventArgs<Cmt>];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
  }

  onOpenEditorRequested(cb: (e: OpenCmtEditorRequest) => void) {
    this.events.addListener(openEditorRequested, (arg) => cb(arg as OpenCmtEditorRequest));
  }

  async loadMoreAsync(parentCmt?: string) {
    if (parentCmt) {
      await this.replyCollectors[parentCmt]?.loadMoreAsync();
    } else {
      await this.rootCollector.loadMoreAsync();
    }
  }

  addCmt(parent: string | null, cmt: Cmt) {
    if (parent) {
      this.replyCollectors[parent]?.prepend([cmt]);
    } else {
      this.rootCollector.prepend([cmt]);
    }
  }

  removeCmt(id: string, parent: string | null) {
    const collector = parent ? this.replyCollectors[parent] : this.rootCollector;
    if (collector) {
      collector.deleteItem(id);
    }
  }

  updateCmt(id: string, parent: string | null, cmt: Cmt) {
    const collector = parent ? this.replyCollectors[parent] : this.rootCollector;
    if (collector) {
      collector.replaceItem(id, cmt);
    }
  }

  // Opens the shared editor with the given arguments.
  requestOpenEditor(req: OpenCmtEditorRequest) {
    this.events.emit(openEditorRequested, req);
  }

  // Called in `cmt-block.firstUpdated`.
  initRootCmt(cmt: Cmt) {
    const { events } = this;
    const collector = new CmtCollector(
      undefined,
      {
        parentCmtID: cmt.id,
        page: startPage,
      },
      (status) => events.emit(childLoadingStatusChanged, [cmt, status]),
      (e) => events.emit(childItemsChanged, [cmt, e]),
    );
    this.replyCollectors[cmt.id] = collector;
  }
}
