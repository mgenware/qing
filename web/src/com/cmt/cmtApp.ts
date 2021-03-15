import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/lists/itemCounter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import './cmtView';
import './addCmtApp';
import './cmtListView';
import { CHECK } from 'checks';
import 'qing-overlay';
import 'ui/editor/composerView';
import Cmt from './cmt';
import { tif } from 'lib/htmlLib';
import { entityCmt, entityReply } from 'sharedConstants';
import ls, { formatLS } from 'ls';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';

const composerID = 'composer';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.number initialCount = 0;
  @lp.string hostID = '';
  @lp.number hostType = 0;

  // Editor-related props.
  @lp.bool editorOpen = false;
  @lp.string editorEntityID = '';
  @lp.number editorEntityType = 0;
  @lp.string editorSubmitButtonText = '';
  @lp.object editorQuotedCmt: Cmt | null = null;

  @lp.number private totalCount = 0;

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
    this.totalCount = this.initialCount;
  }

  render() {
    const { editorQuotedCmt } = this;
    return html`
      <cmt-list-view
        .totalCount=${this.totalCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .loadOnVisible=${!!this.initialCount}
        @totalCountChangedWithOffset=${this.handleTotalCountChangedWithOffset}
      ></cmt-list-view>
      <qing-overlay
        class="immersive"
        ?open=${this.editorOpen}
        @openChanged=${(e: CustomEvent<boolean>) => (this.editorOpen = e.detail)}
      >
        <h2>
          ${editorQuotedCmt ? formatLS(ls.pReplyTo, editorQuotedCmt.userName) : ls.writeAComment}
        </h2>
        ${tif(
          editorQuotedCmt,
          html`<blockquote>${unsafeHTML(editorQuotedCmt?.contentHTML)}</blockquote>`,
        )}
        <composer-view
          .entityID=${this.editorEntityID}
          .entityType=${this.editorEntityType}
          .submitButtonText=${this.editorSubmitButtonText}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}
        ></composer-view>
      </qing-overlay>
    `;
  }

  private showEditor(editingCmt: Cmt | null, quotedCmt: Cmt | null, isReply: boolean) {
    // Editor-related props must be reset on each session. To ensure that, we declare those
    // vars locally and re-assign them at the end of the func.
    let entityID = '';
    const entityType = isReply ? entityReply : entityCmt;
    if (editingCmt) {
      entityID = editingCmt.id;
    }

    this.editorQuotedCmt = quotedCmt;
    this.editorEntityID = entityID;
    this.editorEntityType = entityType;
    this.editorOpen = true;
  }

  private handleDiscard() {
    this.editorOpen = false;
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const loader = new SetPostLoader(this.editedID, e.detail, this.entityType);
    if (this.discussionID) {
      loader.discussionID = this.discussionID;
    }
    const status = await app.runGlobalActionAsync(
      loader,
      this.editedID ? ls.saving : ls.publishing,
    );
    if (status.data) {
      this.composerEl?.markAsSaved();
      app.page.setURL(status.data);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
