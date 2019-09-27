import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import app from 'app';
import { format, ls } from 'ls';
import DeletePostLoader from './loaders/deletePostLoader';
import wind from 'app/wind';
import routes from 'routes';

@customElement('post-admin-app')
export class PostAdminBar extends BaseElement {
  @property() targetID = '';
  @property() targetUserID = '';
  @property({ type: Boolean }) leftMargin = false;

  render() {
    const userID = app.state.userID;
    if (!userID || this.targetUserID !== userID) {
      return html``;
    }
    return html`
      <span class="${this.leftMargin ? 'm-l-sm' : ''}">
        <a href="#" @click=${this.onEditClick}>${ls.edit}</a>
        <a class="m-l-sm" href="#" @click=${this.onDeleteClick}>${ls.delete}</a>
      </span>
    `;
  }

  protected onEditClick() {
    const postID = wind.postID;
    const url = routes.dashboard.editPost + '/' + postID;
    app.browser.jumpToURL(url);
  }

  protected async onDeleteClick() {
    if (await app.alert.confirm(format('pDoYouWantToDeleteThis', ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(this.targetID);
      const res = await app.runActionAsync(loader, ls.working);
      if (res.isSuccess) {
        // Redirect to profile page since this page has been deleted
        app.browser.setURL(res.getResult() as string);
      }
    }
  }
}
