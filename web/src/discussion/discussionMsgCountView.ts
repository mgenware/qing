import { html, customElement, css } from 'lit-element';
import ls, { formatLS } from 'ls';
import BaseElement from 'baseElement';
import discussionWind from './discussionWind';

@customElement('discussion-msg-count-view')
export class DiscussionMsgCountView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
      <div>
        <h2>${formatLS(ls.numOfMsgs, discussionWind.ReplyCount)}</h2>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discussion-msg-count-view': DiscussionMsgCountView;
  }
}
