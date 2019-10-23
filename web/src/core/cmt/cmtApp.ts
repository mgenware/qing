import { html, customElement, property, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/loadingView';
import Status from 'lib/status';
import ls from 'ls';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  @property() url = '';
  @property() initialCount = 0;
  @property({ type: Object }) status = new Status();

  render() {
    let header = html`
      <h2>${ls.comments}</h2>
    `;
    let content: TemplateResult;
    if (!this.initialCount) {
      content = html`
        <span>${ls.noComment}</span>
      `;
    } else {
      content = html`
        <loading-view
          .status=${this.status}
          .canRetry=${true}
          @onRetry=${this.reloadAll}
        ></loading-view>
      `;
    }
    return html`
      ${header}${content}
    `;
  }

  private reloadAll() {}
}
