/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { CHECK } from 'checks';
import { EventEmitter } from 'lib/eventEmitter';
import { ItemsChangedEvent, ItemsChangedSource } from 'lib/itemCollector';
import LoadingStatus from 'lib/loadingStatus';
import Cmt from './cmt';
import CmtCollector from './cmtCollector';

const rootLoadingStatusChanged = 'rootLoadingStatusChanged';
const rootItemsChanged = 'rootItemsChanged';
const childLoadingStatusChanged = 'childLoadingStatusChanged';
const childItemsChanged = 'childItemsChanged';
const openEditorRequested = 'openEditorRequested';
const totalCmtCountChangedWithOffset = 'totalCmtCountChangedWithOffset';
const deleteCmtRequested = 'deleteCmtRequested';
const startPage = 1;

export interface CmtEditorProps {
  open: boolean;

  // If not null, we're editing a comment or reply.
  editing: Cmt | null;
  // If not null, we're adding or editing a reply.
  parent: Cmt | null;
  // When you reply another reply, `parent` is their parent, but
  // `replyingTo` would be the reply you're replying to.
  replyingTo: Cmt | null;
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
      // Root collector's total count is useless, it only tracks the number of root comments.
      0,
      {
        hostID,
        hostType,
        page: startPage,
      },
      undefined,
      (status) => events.emit(rootLoadingStatusChanged, status),
      (e) => {
        // Sync root cmt collectors.
        const { detail } = e;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (detail.added) {
          for (const id of detail.added) {
            const cmt = e.sender.items.map.get(id);
            CHECK(cmt);
            this.initRootCmtCollector(cmt);
          }
        }
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (detail.removed) {
          for (const id of detail.removed) {
            delete this.replyCollectors[id];
          }
        }
        // Changes triggered by "view more" doesn't count as cmt number changes.
        if (e.source === ItemsChangedSource.userAction) {
          this.handleTotalCmtCountChangeWithOffset(e.changed);
        }
        events.emit(rootItemsChanged, e);
      },
    );
  }

  onRootLoadingStatusChanged(cb: (status: LoadingStatus) => void) {
    this.events.addListener(rootLoadingStatusChanged, (arg) => cb(arg as LoadingStatus));
  }

  onRootItemsChanged(cb: (e: ItemsChangedEvent<Cmt>) => void) {
    this.events.addListener(rootItemsChanged, (arg) => cb(arg as ItemsChangedEvent<Cmt>));
  }

  onChildLoadingStatusChanged(cmtID: string, cb: (e: LoadingStatus) => void) {
    this.events.addListener(childLoadingStatusChanged, (arg) => {
      const typedArgs = arg as [Cmt, LoadingStatus];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
  }

  onChildItemsChanged(cmtID: string, cb: (e: ItemsChangedEvent<Cmt>) => void) {
    this.events.addListener(childItemsChanged, (arg) => {
      const typedArgs = arg as [Cmt, ItemsChangedEvent<Cmt>];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
  }

  onOpenEditorRequested(cb: (e: CmtEditorProps) => void) {
    this.events.addListener(openEditorRequested, (arg) => cb(arg as CmtEditorProps));
  }

  onDeleteCmtRequested(cb: (e: [string, Cmt]) => void) {
    this.events.addListener(deleteCmtRequested, (arg) => cb(arg as [string, Cmt]));
  }

  onTotalCmtCountChangedWithOffset(cb: (count: number) => void) {
    this.events.addListener(totalCmtCountChangedWithOffset, (arg) => cb(arg as number));
  }

  async loadMoreAsync(parentCmt?: string) {
    if (parentCmt) {
      await this.replyCollectors[parentCmt]?.loadMoreAsync();
    } else {
      await this.rootCollector.loadMoreAsync();
    }
  }

  addCmt(parent: string | null, cmt: Cmt) {
    const collector = this.getCollector(parent);
    collector?.items.insert(0, cmt);
  }

  removeCmt(parent: string | null, id: string) {
    const collector = this.getCollector(parent);
    collector?.items.deleteByKey(id);
  }

  updateCmt(parent: string | null, id: string, cmt: Cmt) {
    const collector = this.getCollector(parent);
    collector?.items.updateByKey(id, cmt);
  }

  // Opens the shared editor with the given arguments.
  requestOpenEditor(req: CmtEditorProps) {
    this.events.emit(openEditorRequested, req);
  }

  requestDeleteCmt(e: [string, Cmt]) {
    this.events.emit(deleteCmtRequested, e);
  }

  private initRootCmtCollector(cmt: Cmt) {
    const { events } = this;
    const collector = new CmtCollector(
      // Use `cmt.replyCount` as the initial count for this collector.
      cmt.replyCount,
      undefined,
      {
        parentCmtID: cmt.id,
        page: startPage,
      },
      (status) => events.emit(childLoadingStatusChanged, [cmt, status]),
      (e) => {
        // Any reply count changes affect total comment count.
        this.handleTotalCmtCountChangeWithOffset(e.changed);
        events.emit(childItemsChanged, [cmt, e]);
      },
    );
    this.replyCollectors[cmt.id] = collector;
  }

  private getCollector(parentID: string | null): CmtCollector | undefined {
    return parentID ? this.replyCollectors[parentID] : this.rootCollector;
  }

  private handleTotalCmtCountChangeWithOffset(offset: number) {
    this.events.emit(totalCmtCountChangedWithOffset, offset);
  }
}
