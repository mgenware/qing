import { html, customElement } from 'lit-element';
import ls, { formatLS } from 'ls';
import BaseElement from 'baseElement';
import discussionWind from './discussionWind';

@customElement('discussion-msg-count-view')
export class DiscussionMsgCountView extends BaseElement {
  render() {
    return html`
      <div>
        <h2>${formatLS(ls.numOfMsgs, discussionWind.appDiscussionCmtCount)}</h2>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discussion-msg-count-view': DiscussionMsgCountView;
  }
}
