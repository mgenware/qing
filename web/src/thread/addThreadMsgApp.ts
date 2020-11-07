import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import 'ui/editor/composerView';
import { entityThread } from 'sharedConstants';
import threadWind from './threadWind';
import { ComposerContent } from 'ui/editor/composerView';

@customElement('add-thread-msg-app')
export class AddThreadMsgApp extends BaseElement {
  render() {
    return html`
      <composer-view
        .id=${threadWind.appThreadID}
        .headerText=${ls.postAMsgToThisThread}
        .entityType=${entityThread}
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
