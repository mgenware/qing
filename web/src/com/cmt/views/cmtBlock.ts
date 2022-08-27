/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, repeat, property, state } from 'll';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { cache } from 'lit/directives/cache.js';
import Entity from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import './cmtLoadMoreView';
import 'ui/buttons/linkButton';
import { Cmt } from '../data/cmt';
import { CHECK } from 'checks';
import { ItemsChangedEvent } from 'lib/itemCollector';
import appAlert from 'app/appAlert';
import CmtCollector from '../data/cmtCollector';
import { listenForVisibilityChange } from 'lib/htmlLib';
import DeleteCmtLoader from '../loaders/deleteCmtLoader';
import appTask from 'app/appTask';
import { appdef } from '@qing/def';
import { ComposerView } from 'ui/editing/composerView';
import { SetCmtLoader } from '../loaders/setCmtLoader';

const editEditorID = 'edit-editor';
const replyEditorID = 'reply-editor';

@customElement('cmt-block')
// If `cmt` is present, it displays the cmt and its replies.
// Otherwise, it displays a list of root level cmts.
export class CmtBlock extends BaseElement {
  static override get styles() {
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

  @property({ type: Object }) host!: Entity;
  @property({ type: Object }) cmt: Cmt | null = null;

  // Starts loading comment when the component is first visible.
  @property({ type: Boolean }) loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @state() _items: readonly Cmt[] = [];

  // Available when `loadMore` is called.
  @state() _hasNext = false;

  // Number of replies under this comment.
  // Not available when `cmt` is null.
  @state() _replyCount = 0;
  @state() _collectorLoadingStatus = LoadingStatus.success;

  @state() _replyViewVisible = false;

  @state() private _replyEditorOpen = false;
  @state() private _replyEditorQuoteHTML = '';
  @state() private _editEditorOpen = false;

  private _collector!: CmtCollector;
  // Tracks if `loadMore` has been called once. Used in reply view click handler.
  private _loadMoreCalled = false;

  private get editEditorEl() {
    return this.getShadowElement<ComposerView>(editEditorID);
  }

  private get replyEditorEl() {
    return this.getShadowElement<ComposerView>(replyEditorID);
  }

  override firstUpdated() {
    CHECK(this.host);

    const { cmt } = this;
    if (cmt) {
      // We are displaying replies from a cmt.
      this._collector = CmtCollector.replies(
        cmt.cmtCount || 0,
        cmt.id,
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
      this._replyCount = cmt.cmtCount ?? 0;
    } else {
      // We are displaying root cmts from a post.
      this._collector = CmtCollector.rootCmts(
        this.host,
        (st) => (this._collectorLoadingStatus = st),
        (e) => this.handleCollectorItemsChanged(e),
      );
    }

    if (this.loadOnVisible) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listenForVisibilityChange([this], () => this.loadMore());
    }
  }

  override render() {
    const { cmt } = this;
    const itemsView = repeat(
      this._items,
      (it) => it.id,
      (it) =>
        html`<cmt-block
          class="m-t-md"
          .host=${this.host}
          .cmt=${it}
          @cmt-block-request-delete-child=${this.handleRequestDeleteChild}
          @cmt-block-request-update-child=${this.handleRequestUpdateChild}></cmt-block>`,
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
                @load-more-click=${this.loadMore}></cmt-load-more-view>`
          : '',
      )}
    </div>`;

    return html`
      <div>
        ${when(
          cmt,
          () => html`<cmt-view
              .cmt=${cmt}
              @cmt-view-reply-click=${() => this.handleReplyClick(cmt)}
              @cmt-view-edit-click=${this.handleEditClick}
              @cmt-view-delete-click=${this.handleDeleteClick}></cmt-view>
            ${when(
              this._editEditorOpen,
              () => html`
                <qing-overlay class="immersive" open>
                  <composer-view
                    id=${editEditorID}
                    .desc=${ls.editComment}
                    .entity=${{ id: this.cmt?.id ?? '', type: appdef.contentBaseTypeCmt }}
                    .submitButtonText=${ls.save}
                    @composer-submit=${this.handleEditEditorSubmit}
                    @composer-discard=${this.handleEditEditorDiscard}></composer-view>
                </qing-overlay>
              `,
            )}
            ${when(
              this._replyEditorOpen,
              () => html`
                <qing-overlay class="immersive" open>
                  <composer-view
                    id=${replyEditorID}
                    .desc=${formatLS(ls.pReplyTo, this.cmt?.userName)}
                    .submitButtonText=${ls.send}
                    @composer-submit=${this.handleReplyEditorSubmit}
                    @composer-discard=${this.handleReplyEditorDiscard}>
                    <blockquote slot="header" style="margin-top:0">
                      ${unsafeHTML(this._replyEditorQuoteHTML)}
                    </blockquote>
                  </composer-view>
                </qing-overlay>
              `,
            )} `,
        )}
        ${itemsContainer}
      </div>
    `;
  }

  // Called in outer `root-cmt-list` to prepend a new cmt.
  addRootCmt(cmt: Cmt) {
    CHECK(this._collector.observableItems.insert(0, cmt));
  }

  private async handleEditEditorSubmit() {
    if (!this.editEditorEl || !this.cmt) {
      return;
    }
    const loader = SetCmtLoader.editCmt(this.host, this.cmt.id, {
      contentHTML: this.editEditorEl.contentHTML ?? '',
    });
    const apiRes = await appTask.critical(loader, ls.publishing);
    if (apiRes.data) {
      this.destroyEditEditor();
      const newCmt = apiRes.data.cmt;
      const mergedCmt: Cmt = {
        ...this.cmt,
      };

      // We have to iterate through response cmt properties and only update non-empty
      // properties.
      for (const [k, v] of Object.entries(newCmt)) {
        if (v) {
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
          (mergedCmt as any)[k] = v;
        }
      }

      this.cmt = mergedCmt;
      this.dispatchEvent(
        new CustomEvent<Cmt>('cmt-block-request-update-child', { detail: this.cmt }),
      );
    }
  }

  private async handleReplyEditorSubmit() {
    if (!this.replyEditorEl || !this.cmt) {
      return;
    }
    const loader = SetCmtLoader.newReply(this.host, this.cmt.id, {
      contentHTML: this.replyEditorEl.contentHTML ?? '',
    });
    const apiRes = await appTask.critical(loader, ls.publishing);
    if (apiRes.data) {
      this.destroyReplyEditor();
      const newCmt = apiRes.data.cmt;
      CHECK(this._collector.observableItems.insert(0, newCmt));
    }
  }

  private handleEditEditorDiscard() {
    this.destroyEditEditor();
  }

  private handleReplyEditorDiscard() {
    this.destroyReplyEditor();
  }

  private destroyEditEditor() {
    this.editEditorEl?.markAsSaved();
    this._editEditorOpen = false;
  }

  private destroyReplyEditor() {
    this.replyEditorEl?.markAsSaved();
    this._replyEditorQuoteHTML = '';
    this._replyEditorOpen = false;
  }

  private async loadMore() {
    await this._collector.loadMoreAsync(this.freshChildren());
  }

  private freshChildren() {
    // Get newly added cmt IDs.
    let excluded: string[] | null = this._items.filter((it) => it.uiHighlighted).map((it) => it.id);
    if (!excluded.length) {
      excluded = null;
    }
    return excluded;
  }

  private handleReplyClick(cmt: Cmt | null) {
    this._replyEditorQuoteHTML = cmt?.contentHTML ?? '';
    this._replyEditorOpen = true;
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
          this.dispatchEvent(
            new CustomEvent<Cmt>('cmt-block-request-delete-child', { detail: this.cmt }),
          );
        }
      }
    }
  }

  private handleEditClick() {
    this._editEditorOpen = true;
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
      new CustomEvent<ItemsChangedEvent<Cmt>>('cmt-block-items-change', {
        detail: e,
        composed: true,
      }),
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
