import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import 'ui/editor/composerView';
import 'post/setPostApp';
import { entityDiscussionMsg } from 'sharedConstants';
import discussionWind from './discussionWind';
import { CHECK } from 'checks';

@customElement('add-discussion-msg-app')
export class AddDiscussionMsgApp extends BaseElement {
  firstUpdated() {
    CHECK(discussionWind.EID);
  }

  render() {
    return html`
      <set-post-app
        .headerText=${ls.postAMsgToThisDiscussion}
        .entityType=${entityDiscussionMsg}
        .submitButtonText=${ls.send}
        .discussionID=${discussionWind.EID}
        .showCancelButton=${true}
        .showTitleInput=${false}
      ></set-post-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-discussion-msg-app': AddDiscussionMsgApp;
  }
}
