import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/status/statusView';
import 'ui/panels/centeredView';
import 'ui/content/headingView';
import 'ui/form/inputView';
import 'ui/editor/editorView';
import LoadingStatus from 'lib/loadingStatus';
import SetForumEditingInfoLoader from './loaders/setForumEditingInfoLoader';
import { GetForumEditingInfoLoader } from './loaders/getForumEditingInfo';
import { CHECK } from 'checks';
import EditorView from 'ui/editor/editorView';

const editorElementID = 'editor';

@customElement('forum-general-settings-app')
export class ForumGeneralSettingsApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .profile-img {
          border: 1px solid var(--app-default-separator-color);
        }

        input-view {
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  @lp.string fid = '';
  @lp.string name = '';
  @lp.object loadingStatus = LoadingStatus.empty;
  @lp.bool updateInfoStatus = LoadingStatus.success;
  @lp.string avatarURL = '';

  updateInfoLoader!: SetForumEditingInfoLoader;

  private descEditorView!: EditorView;

  async firstUpdated() {
    CHECK(this.fid);
    this.descEditorView = this.mustGetShadowElement(editorElementID);

    await this.reloadDataAsync();
  }

  render() {
    const { loadingStatus } = this;
    return html` ${loadingStatus.isSuccess ? this.renderContent() : this.renderProgress()} `;
  }

  renderProgress() {
    const { loadingStatus } = this;
    return html`
      <centered-view .height=${'400px'}>
        <status-view
          .status=${loadingStatus}
          .canRetry=${true}
          @onRetry=${this.handleLoadingRetry}
        ></status-view
      ></centered-view>
    `;
  }

  renderContent() {
    return html`
      <status-overlay .status=${this.updateInfoStatus}>
        <heading-view>${ls.general}</heading-view>
        <input-view
          required
          label=${ls.name}
          value=${this.name}
          @onChange=${(e: CustomEvent<string>) => (this.name = e.detail)}
        ></input-view>

        <editor-view id="editor"></editor-view>

        <qing-button btnStyle="success" @click=${this.handleSaveInfoClick}>
          ${ls.save}
        </qing-button>
      </status-overlay>
    `;
  }

  private async reloadDataAsync() {
    const loader = new GetForumEditingInfoLoader(this.fid);
    const status = await app.runGlobalActionAsync(
      loader,
      undefined,
      (s) => (this.loadingStatus = s),
    );
    if (status.data) {
      const info = status.data;
      this.name = info.name ?? '';
      this.descEditorView.contentHTML = info.descHTML ?? '';
    }
  }

  private async handleSaveInfoClick() {
    // Validate user inputs.
    try {
      if (!this.name) {
        throw new Error(formatLS(ls.pPlzEnterThe, ls.name));
      }
    } catch (err) {
      await app.alert.error(err.message);
      return;
    }
    const descHTML = this.descEditorView.contentHTML;
    const loader = new SetForumEditingInfoLoader(this.fid, this.name, descHTML);
    await app.runGlobalActionAsync(loader, ls.saving, (s) => {
      this.updateInfoStatus = s;
    });
  }

  private async handleLoadingRetry() {
    await this.reloadDataAsync();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forum-general-settings-app': ForumGeneralSettingsApp;
  }
}
