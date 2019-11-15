import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/editor/composerView';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import EditorView from 'ui/editor/editorView';

@customElement('add-cmt-app')
export class AddCmtApp extends BaseElement {
  @property() eID = '';
  @property({ type: Number }) eType = 0;
  @property({ type: Boolean }) private expanded = true;
  private editor!: EditorView;

  firstUpdated() {
    this.editor = this.mustGetShadowElement('cmt-editor');
  }

  render() {
    if (!this.expanded) {
      return html`
        <p>
          <lit-button @click=${this.handleCommentButtonClick}
            >${ls.writeAComment}</lit-button
          >
        </p>
      `;
    }
    return html`
      <composer-view
        id="cmt-editor"
        .showTitle=${false}
        .entityType=${EntityType.cmt}
        .attachedEntityID=${this.eID}
        .attachedEntityType=${this.eType}
        .submitButtonText=${ls.comment}
        @onSubmit=${this.handleSubmit}
      ></composer-view>
    `;
  }

  private handleCommentButtonClick() {
    this.expanded = true;
  }

  private handleSubmit() {
    const { editor } = this;
    if (!editor) {
      return;
    }
    const loader = new SetPostLoader(this.editedID, e.detail);
    const status = await app.runGlobalActionAsync(
      loader,
      this.editedID ? ls.saving : ls.publishing,
    );
    if (status.data) {
      app.browser.setURL(status.data);
    }
  }
}
