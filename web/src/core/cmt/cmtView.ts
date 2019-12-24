import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/timeField';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Cmt from './cmt';

@customElement('cmt-view')
export class CmtView extends BaseElement {
  @property({ type: Object }) cmt: Cmt | null = null;

  render() {
    const { cmt } = this;
    if (!cmt) {
      return html``;
    }
    return html`
      <div class="m-t-md row">
        <div class="col-auto">
          <a href=${cmt.userURL}>
            <img
              src=${cmt.userIconURL}
              class="border-radius-5"
              width="50"
              height="50"
            />
          </a>
        </div>
        <div class="col">
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            <time-field
              .createdAt=${cmt.createdAt}
              .modifiedAt=${cmt.modifiedAt}
            ></time-field>
          </div>
          <div>
            ${unsafeHTML(cmt.content)}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
