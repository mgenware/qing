import { html, customElement } from 'lit-element';
import ls, { formatLS } from 'ls';
import BaseElement from 'baseElement';
import threadWind from './threadWind';

@customElement('thread-msg-count-view')
export class ThreadMsgCountView extends BaseElement {
  render() {
    return html`
      <div>
        <h2>${formatLS(ls.numOfMsgs, threadWind.appThreadCmtCount)}</h2>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'thread-msg-count-view': ThreadMsgCountView;
  }
}
