import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import app from 'app';
import { formatLS, ls } from 'ls';
import DeletePostLoader from './loaders/deletePostLoader';
import wind from 'app/wind';
import routes from 'routes';
import 'ui/editor/editBar';

@customElement('post-admin-app')
export class PostAdminApp extends BaseElement {
  @property() targetID = '';
  @property() targetUserID = '';

  render() {
    const userID = app.state.userID;
    if (!userID || this.targetUserID !== userID) {
      return html``;
    }
    return html`
      <edit-bar
        .hasLeftMargin=${true}
        @editClick=${this.onEditClick}
        @deleteClick=${this.onDeleteClick}
      ></edit-bar>
    `;
  }

  protected onEditClick() {
    const postID = wind.postID;
    const url = routes.m.editPost + '/' + postID;
    app.browser.jumpToURL(url);
  }

  protected async onDeleteClick() {
    if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(this.targetID);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted
        app.browser.setURL(status.data);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-admin-app': PostAdminApp;
  }
}
