/* eslint-disable class-methods-use-this */
import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import app from 'app';
import { formatLS, ls } from 'ls';
import routes from 'routes';
import 'ui/editor/editBar';
import postWind from './postWind';
import DeletePostLoader from './loaders/deletePostLoader';

@customElement('post-admin-app')
export class PostAdminApp extends BaseElement {
  @property() targetID = '';
  @property() targetUserID = '';

  render() {
    const { userID } = app.state;
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
    const postID = postWind.appPostID;
    const url = `${routes.home.editPost}/${postID}`;
    app.browser.jumpToURL(url);
  }

  protected async onDeleteClick() {
    if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(this.targetID);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
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
