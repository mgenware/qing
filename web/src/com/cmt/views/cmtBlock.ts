/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, repeat } from 'll';
import * as lp from 'lit-props';
import Entity from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import './cmtFooterView';
import { Cmt } from '../data/cmt';
import { CmtEditorProps, openCmtEditorRequestedEvent } from '../data/events';
import { CHECK } from 'checks';
import { ItemsChangedEvent } from 'lib/itemCollector';
import appAlert from 'app/appAlert';
import CmtCollector from '../data/cmtCollector';
import { listenForVisibilityChange } from 'lib/htmlLib';
import DeleteCmtLoader from '../loaders/deleteCmtLoader';
import appTask from 'app/appTask';

const startPage = 1;

@customElement('cmt-block')
// If `cmt` is present, it displays the cmt and its replies.
// Otherwise, it displays a list of root level cmts.
export class CmtBlock extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .reply-block {
          border-left: 1px solid var(--app-default-separator-color);
          margin-left: 1.5rem;
          padding-left: 1.5rem;
        }
      `,
    ];
  }

  @lp.object host!: Entity;
  @lp.object cmt: Cmt | null = null;

  // Starts loading comment when the component is first visible.
  @lp.bool loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.state _items: readonly Cmt[] = [];

  // Available when `loadMore` is called.
  @lp.state _hasNext = false;

  // Number of replies under this comment.
  // Not available when `cmt` is null.
  @lp.state _totalReplyCount = 0;
  @lp.state _collectorLoadingStatus = LoadingStatus.success;

  private _collector?: CmtCollector;

  firstUpdated() {
    CHECK(this.host);
    const { cmt } = this;
    if (cmt) {
      // We are displaying replies from a cmt.
      this._collector = CmtCollector.replies(
        cmt.replyCount || 0,
        {
          parentID: cmt.id,
          page: startPage,
        },
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
      this._totalReplyCount = cmt.replyCount ?? 0;
    } else {
      // We are displaying root cmts from a post.
      this._collector = CmtCollector.rootCmts(
        {
          host: this.host,
          page: startPage,
        },
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
    }

    if (this.loadOnVisible) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listenForVisibilityChange([this], () => this._collector?.loadMoreAsync());
    }
  }

  render() {
    const { cmt } = this;
    const itemsView = repeat(
      this._items,
      (it) => it.id,
      (it) =>
        html`<cmt-block
          class="m-t-md"
          .host=${this.host}
          .cmt=${it}
          @deleteMeRequested=${this.handleReplyDeleteMeRequest}></cmt-block>`,
    );
    const itemsContainer = html`<div class=${cmt ? 'reply-block' : ''}>
      ${itemsView}
      ${this._totalReplyCount
        ? html`<div>
            <small class="is-secondary">${formatLS(ls.pNOReplies, this._totalReplyCount)}</small>
          </div>`
        : html``}
      <cmt-footer-view
        class="m-t-sm m-b-md"
        .replies=${true}
        .status=${this._collectorLoadingStatus}
        .hasNext=${this._hasNext}
        .loadedCount=${this._items.length}
        @viewMoreClick=${this.handleViewMore}></cmt-footer-view>
    </div>`;

    return html`
      <div>
        ${when(
          cmt,
          () => html`<cmt-view
            .cmt=${cmt}
            @replyClick=${this.handleReplyClick}
            @editClick=${this.handleEditClick}
            @deleteClick=${this.handleDeleteClick}></cmt-view>`,
        )}
        ${itemsContainer}
      </div>
    `;
  }

  // When adding a cmt to root-cmt-list, it's called by <root-cmt-list>.
  // When adding a reply, it's called by `handleReplyClick`.
  openCmtEditor(props: Omit<CmtEditorProps, 'done'>) {
    const detail: CmtEditorProps = {
      ...props,
      done: (cmt) => {
        if (props.editing) {
          this._collector?.observableItems.update(cmt);
        } else {
          this._collector?.observableItems.insert(0, cmt);
        }
      },
    };
    this.dispatchEvent(
      new CustomEvent<CmtEditorProps>(openCmtEditorRequestedEvent, { detail, composed: true }),
    );
  }

  private async handleViewMore() {
    await this._collector?.loadMoreAsync();
  }

  private handleReplyClick() {
    this.openCmtEditor({
      editing: null,
      to: this.cmt,
    });
  }

  private async handleDeleteClick() {
    if (await appAlert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.comment))) {
      CHECK(this.cmt);
      const loader = new DeleteCmtLoader(this.cmt.id, this.host);
      const status = await appTask.critical(loader, ls.working);
      if (status.isSuccess) {
        // If there are replies, erase the cmt content.
        // Otherwise, request deleting this cmt instead.
        if (this._totalReplyCount) {
          this.cmt = {
            ...this.cmt,
            contentHTML: '',
            uiDeleted: true,
          };
        } else {
          this.dispatchEvent(new CustomEvent<Cmt>('deleteMeRequested', { detail: this.cmt }));
        }
      }
    }
  }

  private handleEditClick() {
    this.openCmtEditor({ editing: this.cmt, to: null });
  }

  private handleCollectorItemsChanged(e: ItemsChangedEvent<Cmt>) {
    if (!e.triggeredByLoading) {
      // *** Changed by user actions (adding, removing, editing) ***

      // Set `cmt.isNew` to true in-place if a newly added cmt is found.
      // This has to be done before setting the `items`.
      const newID = e.detail.added?.[0];
      if (newID) {
        const newCmt = e.sender.observableItems.map.get(newID);
        if (newCmt) {
          newCmt.uiHighlighted = true;
        }
      }
    }
    this._hasNext = e.hasNext;
    this._items = e.items;
    this.dispatchEvent(
      new CustomEvent<ItemsChangedEvent<Cmt>>('cmtItemsChanged', { detail: e, composed: true }),
    );
  }

  private handleReplyDeleteMeRequest(e: CustomEvent<Cmt>) {
    // MUST BE handled by immediate parent.
    e.stopPropagation();
    this._collector?.observableItems.deleteByKey(e.detail.id);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-block': CmtBlock;
  }
}
