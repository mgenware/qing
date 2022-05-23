/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, repeat } from 'll';
import * as lp from 'lit-props';
import { cache } from 'lit/directives/cache.js';
import Entity from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import './cmtLoadMoreView';
import 'ui/buttons/linkButton';
import { Cmt } from '../data/cmt';
import * as ev from '../data/events';
import { CHECK } from 'checks';
import { ItemsChangedEvent } from 'lib/itemCollector';
import appAlert from 'app/appAlert';
import CmtCollector from '../data/cmtCollector';
import { listenForVisibilityChange } from 'lib/htmlLib';
import DeleteCmtLoader from '../loaders/deleteCmtLoader';
import appTask from 'app/appTask';
import appEventEmitter from 'app/appEventEmitter';

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

        .with-indent {
          margin-left: 1.5rem;
          padding-left: 1.5rem;
          border-left: 1px solid var(--app-default-separator-color);
        }

        /** Used on buttons between cmts */
        .btn-in-cmts {
          margin-top: 1rem;
          margin-bottom: 1.4rem;
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
  @lp.state _replyCount = 0;
  @lp.state _collectorLoadingStatus = LoadingStatus.success;

  @lp.state _replyViewVisible = false;

  private _collector!: CmtCollector;
  // Tracks if `loadMore` has been called once. Used in reply view click handler.
  private _loadMoreCalled = false;

  firstUpdated() {
    CHECK(this.host);

    // Get newly added cmt IDs.
    let excluded: string[] | null = this._items.filter((it) => it.uiHighlighted).map((it) => it.id);
    if (!excluded.length) {
      excluded = null;
    }

    const { cmt } = this;
    if (cmt) {
      // We are displaying replies from a cmt.
      this._collector = CmtCollector.replies(
        cmt.cmtCount || 0,
        {
          parentID: cmt.id,
          page: startPage,
          excluded,
        },
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
      this._replyCount = cmt.cmtCount ?? 0;
    } else {
      // We are displaying root cmts from a post.
      this._collector = CmtCollector.rootCmts(
        {
          host: this.host,
          page: startPage,
          excluded,
        },
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
    }

    if (this.loadOnVisible) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listenForVisibilityChange([this], () => this.loadMore());
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
          @onRequestDeleteChild=${this.handleRequestDeleteChild}
          @onRequestUpdateChild=${this.handleRequestUpdateChild}></cmt-block>`,
    );
    const itemsContainer = html`<div class=${cmt ? 'with-indent' : ''}>
      ${when(
        cmt && this._replyCount,
        () =>
          html`<div class="btn-in-cmts br-replies-btn">
            <link-button @click=${this.handleRepliesLabelClick}
              >${formatLS(ls.pNumOfReplies, this._replyCount) +
              (this._replyViewVisible ? ' ↑' : '')}</link-button
            >
          </div>`,
      )}
      ${cache(
        !cmt || this._replyViewVisible
          ? html`<div class="br-children">${itemsView}</div>
              <cmt-load-more-view
                class="btn-in-cmts"
                .replies=${!!cmt}
                .status=${this._collectorLoadingStatus}
                .hasNext=${this._hasNext}
                @viewMoreClick=${this.loadMore}></cmt-load-more-view>`
          : '',
      )}
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
  openCmtEditor(props: Omit<ev.CmtEditorProps, 'session'>) {
    const session = ev.newSessionID();
    appEventEmitter.once(ev.openEditorResultEvent(session), (rawRes) => {
      const res = rawRes as ev.CmtEditorResult;
      const { cmt } = res;
      if (cmt) {
        if (props.editing) {
          this.dispatchEvent(new CustomEvent<Cmt>('onRequestUpdateChild', { detail: cmt }));
        } else {
          CHECK(this._collector.observableItems.insert(0, cmt));
        }
      }
    });
    const detail: ev.CmtEditorProps = {
      ...props,
      session,
    };
    this.dispatchEvent(
      new CustomEvent<ev.CmtEditorProps>('onRequestCmtEditorOpen', { detail, composed: true }),
    );
  }

  private async loadMore() {
    await this._collector.loadMoreAsync();
  }

  private handleReplyClick() {
    this.openCmtEditor({
      editing: null,
      to: this.cmt,
    });
  }

  private async handleRepliesLabelClick() {
    this._replyViewVisible = !this._replyViewVisible;

    // Call `loadMore` if it's not called once.
    if (!this._loadMoreCalled) {
      this._loadMoreCalled = true;
      await this.loadMore();
    }
  }

  private async handleDeleteClick() {
    if (await appAlert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.comment))) {
      CHECK(this.cmt);
      const loader = new DeleteCmtLoader(this.cmt.id, this.host);
      const status = await appTask.critical(loader, ls.working);
      if (status.isSuccess) {
        // If there are replies, erase the cmt content.
        // Otherwise, request deleting this cmt instead.
        if (this._replyCount) {
          this.cmt = {
            ...this.cmt,
            contentHTML: '',
            uiDeleted: true,
          };
        } else {
          this.dispatchEvent(new CustomEvent<Cmt>('onRequestDeleteChild', { detail: this.cmt }));
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
        CHECK(newCmt);
        newCmt.uiHighlighted = true;
      }
      this._replyCount += e.detail.countDelta;
    }
    this._hasNext = e.hasNext;
    this._items = e.items;

    // When adding a reply when reply view is hidden, this forces reply view to open.
    // Setting `_loadMoreCalled` to true also prevents more items showing when the user
    // clicks the "<number of replies>" button to hide the reply view. Basically, we
    // treat the newly added cmt as a newly loaded cmt.
    this._replyViewVisible = true;
    this._loadMoreCalled = true;

    this.dispatchEvent(
      new CustomEvent<ItemsChangedEvent<Cmt>>('onCmtItemsChange', { detail: e, composed: true }),
    );
  }

  private handleRequestDeleteChild(e: CustomEvent<Cmt>) {
    // MUST BE handled by immediate parent.
    e.stopPropagation();
    CHECK(this._collector.observableItems.deleteByKey(e.detail.id));
  }

  private handleRequestUpdateChild(e: CustomEvent<Cmt>) {
    // MUST BE handled by immediate parent.
    e.stopPropagation();
    CHECK(this._collector.observableItems.update(e.detail));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-block': CmtBlock;
  }
}
