import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import 'ui/editor/composerView';
import threadWind from './threadWind';

@customElement('add-msg-app')
export class AddMsgApp extends BaseElement {
  render() {
    return html`
      <composer-view
        .id=${threadWind.appThreadID}
        .showTitleInput=${false}
        .headerText=${ls.writeAComment}
        .entityType=${EntityType.cmt}
        .submitButtonText=${ls.comment}
        .showCancelButton=${true}
      ></composer-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-msg-app': AddMsgApp;
  }
}
