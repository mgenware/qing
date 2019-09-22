import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import app from 'app';
import { format, ls } from 'ls';

@customElement('post-admin-app')
export class PostAdminBar extends BaseElement {
  @property() targetUserID = '';
  @property({ type: Boolean }) leftMargin = false;

  render() {
    const userID = app.state.userID;
    if (!userID || this.targetUserID !== userID) {
      return html``;
    }
    return html`
      <span class="${this.leftMargin ? 'm-l-sm' : ''}">
        <a @click=${this.onEditClick}>${ls.edit}</a>
        <a class="m-l-sm" href="#" @click=${this.onDeleteClick}>${ls.delete}</a>
      </span>
    `;
  }

  protected onEditClick() {
    throw new Error('Not implemented');
  }

  protected async onDeleteClick() {
    if (await app.alert.confirm(format('pDoYouWantToDeleteThis', ls.post))) {
      console.log('confirmed');
    }
  }
}
