import { html, customElement } from 'lit-element';
import ls from 'ls';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

@customElement('mp-item-view')
export class MPItemView extends BaseElement {
  @lp.string name = '';
  @lp.string link = '';
  @lp.string id = '';

  render() {
    return html`
      <tr>
        <td><a href=${this.link}>${this.name}</a></td>
        <td>
          <a @click=${this.handleDeleteClick}>${ls.delete}</a>
        </td>
      </tr>
    `;
  }

  private handleDeleteClick(e: Event) {
    e.preventDefault();

    this.dispatchEvent(
      new CustomEvent<string>('deleteClick', { detail: this.id }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mp-item-view': MPItemView;
  }
}
