import app from 'app';
import { formatLS, ls } from 'ls';
import { entityPost } from 'sharedConstants';
import { getEditBarID, EditBar } from 'ui/editor/editBar';
import DeletePostLoader from './loaders/deletePostLoader';
import './postCmtApp';
import wind from './postWind';

// Hook up events of edit bar.
if (app.state.userEID) {
  const editBarElement = document.getElementById(
    getEditBarID(entityPost, wind.EID),
  ) as EditBar | null;
  if (editBarElement) {
    editBarElement.addEventListener('deleteClick', async () => {
      if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
        app.alert.showLoadingOverlay(ls.working);
        const loader = new DeletePostLoader(wind.EID, entityPost);
        const res = await app.runGlobalActionAsync(loader);
        if (res.isSuccess && res.data) {
          app.page.setURL(res.data);
        }
      }
    });
  }
}
