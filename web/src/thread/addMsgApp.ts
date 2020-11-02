import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import { EntityType } from 'lib/entity';
import 'ui/editor/composerView';

@customElement('add-msg-app')
export class AddMsgApp extends BaseElement {
  render() {
    return html`
      <composer-view
        .id=${composerID}
        .showTitleInput=${false}
        .headerText=${ls.writeAComment}
        .entityType=${EntityType.cmt}
        .submitButtonText=${ls.comment}
        .showCancelButton=${true}
        @onSubmit=${this.handleSubmit}
        @onDiscard=${this.handleDiscard}
      ></composer-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-msg-app': AddMsgApp;
  }
}
