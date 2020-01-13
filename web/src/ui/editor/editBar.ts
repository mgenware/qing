import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import ls from 'ls';

@customElement('edit-bar')
export class EditBar extends BaseElement {
  render() {
    return html`
      <span>
        <a href="#" @click=${this.handleEditClick}>${ls.edit}</a>
        <a class="m-l-sm" href="#" @click=${this.handleDeleteClick}
          >${ls.delete}</a
        >
      </span>
    `;
  }

  private handleEditClick() {
    this.dispatchEvent(new CustomEvent<undefined>('editClick'));
  }

  private handleDeleteClick() {
    this.dispatchEvent(new CustomEvent<undefined>('deleteClick'));
  }
}
