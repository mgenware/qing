import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/editor/composerView';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import app from 'app';
import ls from 'ls';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import { entityCmt } from 'sharedConstants';
import { CHECK } from 'checks';

const composerID = 'composer';

@customElement('add-cmt-app')
export class AddCmtApp extends BaseElement {
  @lp.string hostID = '';
  @lp.number hostType = 0;
  @lp.bool private open = false;

  // The composer view element is optional in `render` thus has to be
  // accessed on the fly.
  private get composerElement(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
  }

  render() {
    return html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleCommentButtonClick}
          >${ls.writeAComment}</qing-button
        >
      </p>
      <qing-overlay
        class="immersive"
        ?open=${this.open}
        @openChanged=${(e: CustomEvent<boolean>) => (this.open = e.detail)}
      >
        <h2>${ls.writeAComment}</h2>
        <composer-view
          .id=${composerID}
          .entityType=${entityCmt}
          .submitButtonText=${ls.comment}
          .showCancelButton=${true}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}
        ></composer-view>
      </qing-overlay>
    `;
  }

  private handleCommentButtonClick() {
    this.open = true;
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const loader = SetCmtLoader.newCmt(this.hostID, this.hostType, e.detail);
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      this.composerElement?.markAsSaved();

      this.dispatchEvent(
        new CustomEvent<SetCmtResponse>('cmtAdded', {
          detail: status.data,
        }),
      );
    }
  }

  private handleDiscard() {
    this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-cmt-app': AddCmtApp;
  }
}
