import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import 'ui/editor/composerView';
import 'post/setPostApp';
import { entityThreadMsg } from 'sharedConstants';
import threadWind from './threadWind';
import { CHECK } from 'checks';

@customElement('add-thread-msg-app')
export class AddThreadMsgApp extends BaseElement {
  firstUpdated() {
    CHECK(threadWind.appThreadID);
  }

  render() {
    return html`
      <set-post-app
        .headerText=${ls.postAMsgToThisThread}
        .entityType=${entityThreadMsg}
        .submitButtonText=${ls.send}
        .threadID=${threadWind.appThreadID}
        .showCancelButton=${true}
        .showTitleInput=${false}
      ></set-post-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-thread-msg-app': AddThreadMsgApp;
  }
}
