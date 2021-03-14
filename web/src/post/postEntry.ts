import app from 'app';
import { formatLS, ls } from 'ls';
import { entityPost } from 'sharedConstants';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'lit-element';
import { getEditBarID, EditBar } from 'ui/editor/editBar';
import DeletePostLoader from './loaders/deletePostLoader';
import './setPostApp';
import './postPayloadApp';
import wind from './postWind';
import SetPostApp from './setPostApp';

let editPostApp: SetPostApp | null = null;

function hookUpEditBarEvents() {
  if (!app.state.userEID) {
    return;
  }
  const editBarElement = document.getElementById(
    getEditBarID(entityPost, wind.EID),
  ) as EditBar | null;
  if (!editBarElement) {
    return;
  }
  editBarElement.addEventListener('deleteClick', async () => {
    if (await app.alert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(wind.EID, entityPost);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
        app.page.setURL(status.data);
      }
    }
  });

  editBarElement.addEventListener('editClick', async () => {
    if (!editPostApp) {
      editPostApp = renderTemplateResult(
        '',
        html`<set-post-app
          .editedID=${wind.EID}
          entityType=${entityPost}
          headerText=${ls.newPost}
        ></set-post-app>`,
      );
    }
    if (editPostApp) {
      editPostApp.open = true;
    }
  });
}

hookUpEditBarEvents();
