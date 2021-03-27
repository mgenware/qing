/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable lines-between-class-members */

import { CHECK } from 'checks';
import { EventEmitter, EventEntry } from 'lib/eventEmitter';
import { ItemsChangedEvent, ItemsChangedSource } from 'lib/itemCollector';
import LoadingStatus from 'lib/loadingStatus';
import Cmt from './cmt';
import CmtCollector from './cmtCollector';

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

export interface CmtLocation {
  parent: string | null;
  cmt: Cmt;
}

export class CmtDataHub {
  // Collects all root-level comments.
  private rootCollector: CmtCollector;
  // K: root comment ID. V: reply collector of comment K.
  private replyCollectors: Record<string, CmtCollector> = {};

  private events = new EventEmitter();

  rootLoadingStatusChanged = new EventEntry<LoadingStatus>(this.events, 'rootLoadingStatusChanged');
  rootItemsChanged = new EventEntry<ItemsChangedEvent<Cmt>>(this.events, 'rootItemsChanged');
  openEditorRequested = new EventEntry<CmtEditorProps>(this.events, 'openEditorRequested');
  totalCmtCountChangedWithOffset = new EventEntry<number>(
    this.events,
    'totalCmtCountChangedWithOffset',
  );
  deleteCmtRequested = new EventEntry<[string, Cmt]>(this.events, 'deleteCmtRequested');

  private currentHighlighted?: CmtLocation;

  private childLoadingStatusChanged = new EventEntry<[Cmt, LoadingStatus]>(
    this.events,
    'childLoadingStatusChanged',
  );
  private childItemsChanged = new EventEntry<[Cmt, ItemsChangedEvent<Cmt>]>(
    this.events,
    'childItemsChanged',
  );

  constructor(public hostID: string, public hostType: number) {
    this.rootCollector = new CmtCollector(
      // Root collector's total count is useless, it only tracks the number of root comments.
      0,
      {
        hostID,
        hostType,
        page: startPage,
      },
      undefined,
      (status) => this.rootLoadingStatusChanged.dispatch(status),
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
          this.highlightCmtIfNeeded(null, e);
        }
        this.rootItemsChanged.dispatch(e);
      },
    );
  }

  onChildLoadingStatusChanged(cmtID: string, cb: (e: LoadingStatus) => void) {
    this.childLoadingStatusChanged.on((arg) => {
      const typedArgs = arg as [Cmt, LoadingStatus];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
  }

  onChildItemsChanged(cmtID: string, cb: (e: ItemsChangedEvent<Cmt>) => void) {
    this.childItemsChanged.on((arg) => {
      const typedArgs = arg as [Cmt, ItemsChangedEvent<Cmt>];
      if (typedArgs[0]?.id === cmtID) {
        cb(typedArgs[1]);
      }
    });
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
    CHECK(collector);
    collector.items.insert(0, cmt);
  }

  removeCmt(parent: string | null, id: string) {
    const collector = this.getCollector(parent);
    CHECK(collector);
    collector.items.deleteByKey(id);
  }

  updateCmt(parent: string | null, id: string, cmt: Cmt) {
    const collector = this.getCollector(parent);
    collector?.items.updateByKey(id, cmt);
  }

  private initRootCmtCollector(cmt: Cmt) {
    const collector = new CmtCollector(
      // Use `cmt.replyCount` as the initial count for this collector.
      cmt.replyCount,
      undefined,
      {
        parentCmtID: cmt.id,
        page: startPage,
      },
      (status) => this.childLoadingStatusChanged.dispatch([cmt, status]),
      (e) => {
        // Any reply count changes affect total comment count.
        this.handleTotalCmtCountChangeWithOffset(e.changed);
        this.childItemsChanged.dispatch([cmt, e]);
        this.highlightCmtIfNeeded(cmt.id, e);
      },
    );
    this.replyCollectors[cmt.id] = collector;
  }

  private getCollector(parentID: string | null): CmtCollector | undefined {
    return parentID ? this.replyCollectors[parentID] : this.rootCollector;
  }

  private handleTotalCmtCountChangeWithOffset(offset: number) {
    this.totalCmtCountChangedWithOffset.dispatch(offset);
  }

  private highlightCmtIfNeeded(parent: string | null, e: ItemsChangedEvent<Cmt>) {
    // Ignore comments added by 'load more'.
    if (e.source !== ItemsChangedSource.userAction) {
      return;
    }
    const newID = e.detail.added?.[0];
    if (newID && newID !== this.currentHighlighted?.cmt.id) {
      const prev = this.currentHighlighted;
      const newCmt = e.sender.items.map.get(newID);
      CHECK(newCmt);
      this.currentHighlighted = { parent, cmt: newCmt };

      // Un-highlight the previous comment.
      if (prev) {
        const prevCmt = prev.cmt;
        this.updateCmt(prev.parent, prevCmt.id, { ...prevCmt, uiHighlighted: false });
      }

      // Highlight current comment.
      this.updateCmt(parent, newCmt.id, { ...newCmt, uiHighlighted: true });
    }
  }
}
