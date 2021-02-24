import app from 'app';
import { formatLS, ls } from 'ls';
import routes from 'routes';
import { entityPost } from 'sharedConstants';
import { getEditBarID, EditBar } from 'ui/editor/editBar';
import DeletePostLoader from './loaders/deletePostLoader';
import './postCmtApp';
import wind from './postWind';

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
    if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
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
    const url = `${routes.m.editPost}/${wind.EID}`;
    app.page.jumpToURL(url);
  });
}

hookUpEditBarEvents();
