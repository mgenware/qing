import { customElement, html } from 'lit-element';
import './noticeView';
import ls from 'ls';
import { NoticeView } from './noticeView';

@customElement('no-content-view')
export class NoContentView extends NoticeView {
  render() {
    return html` <notice-view>${ls.noContentAvailable}</notice-view> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'no-content-view': NoContentView;
  }
}
