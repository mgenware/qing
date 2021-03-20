import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/lists/itemCounter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import './views/cmtView';
import './views/rootCmtList';
import { CHECK } from 'checks';
import 'qing-overlay';
import 'ui/editor/composerView';
import Cmt from './data/cmt';
import { tif } from 'lib/htmlLib';
import { entityCmt, entityReply } from 'sharedConstants';
import ls, { formatLS } from 'ls';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import { SetCmtLoader } from './loaders/setCmtLoader';
import app from 'app';
import { CmtDataHub, OpenCmtEditorRequest } from './data/cmtDataHub';

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

  @lp.object editorProps: OpenCmtEditorRequest = { open: false };

  @lp.number private totalCount = 0;

  private hub: CmtDataHub;

  constructor() {
    super();

    const hub = new CmtDataHub(this.hostID, this.hostType);
    hub.onOpenEditorRequested((req) => (this.editorProps = req));
    this.hub = hub;
  }

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
    this.totalCount = this.initialCount;
  }

  render() {
    const { editorProps } = this;
    const isReply = !!editorProps.parent;
    return html`
      <root-cmt-list
        .totalCount=${this.totalCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .loadOnVisible=${!!this.initialCount}
        @totalCountChangedWithOffset=${this.handleTotalCountChangedWithOffset}
      ></root-cmt-list>
      <qing-overlay class="immersive" ?open=${editorProps.open}>
        <h2>
          ${editorProps.replyingTo
            ? formatLS(ls.pReplyTo, editorProps.replyingTo.userName)
            : ls.writeAComment}
        </h2>
        ${tif(
          editorProps.replyingTo,
          html`<blockquote>${unsafeHTML(editorProps.replyingTo?.contentHTML)}</blockquote>`,
        )}
        <composer-view
          .entityID=${editorProps.current?.id || ''}
          .entityType=${isReply ? entityReply : entityCmt}
          .submitButtonText=${editorProps.submitButtonText || ''}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}
        ></composer-view>
      </qing-overlay>
    `;
  }

  private handleTotalCountChangedWithOffset(e: CustomEvent<number>) {
    this.totalCount += e.detail;
  }

  private handleDiscard() {
    this.editorProps = { open: false };
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const { editorProps, composerEl, hub } = this;

    let loader: SetCmtLoader;
    if (!editorProps.current) {
      if (editorProps.parent) {
        // Add a reply.
        loader = SetCmtLoader.newReply(
          this.hostID,
          this.hostType,
          // `toUserID`:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          editorProps.replyingTo!.userID,
          // `parentCmtID`:
          editorProps.parent.id,
          e.detail,
        );
      } else {
        // Add a comment.
        loader = SetCmtLoader.newCmt(this.hostID, this.hostType, e.detail);
      }
    } else {
      // Edit a comment or reply.
      loader = SetCmtLoader.editCmt(this.hostID, this.hostType, editorProps.current.id, e.detail);
    }

    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      const serverCmt = status.data.cmt;
      composerEl?.markAsSaved();

      if (!editorProps.current) {
        if (editorProps.parent) {
          // Add a reply.
        } else {
          // Add a comment.
          hub.addCmt(null, serverCmt);
        }
      } else {
        // Edit a comment or reply.

        // Copy all properties from the comment returned from server except for `createdAt`.
        // We're hot patching the cmt object, and the `createdAt` property
        // is something server must return (an empty timestamp) but doesn't
        // make sense here.
        const newCmt: Cmt = {
          ...editorProps.current,
          ...serverCmt,
        };
        newCmt.createdAt = editorProps.current.createdAt;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
