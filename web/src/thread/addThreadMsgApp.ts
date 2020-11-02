import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import 'ui/editor/composerView';
import threadWind from './threadWind';

@customElement('add-thread-msg-app')
export class AddThreadMsgApp extends BaseElement {
  render() {
    return html`
      <composer-view
        .id=${threadWind.appThreadID}
        .showTitleInput=${false}
        .headerText=${ls.postAMsgToThisThread}
        .entityType=${EntityType.cmt}
        .submitButtonText=${ls.send}
        .showCancelButton=${true}
      ></composer-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-thread-msg-app': AddThreadMsgApp;
  }
}
