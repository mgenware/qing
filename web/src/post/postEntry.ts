/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { formatLS, ls } from 'ls';
import { entityPost } from 'sharedConstants';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'll';
import { editBarID, EditBarApp } from 'ui/editor/editBarApp';
// NOTE: `edit-bar-app` is required as it's being used by post page template.
import 'ui/editor/editBarApp';
import DeletePostLoader from './loaders/deletePostLoader';
import './setPostApp';
import './postPayloadApp';
import wind from './postWind';
import SetPostApp from './setPostApp';
import appPageState from 'app/appPageState';
import appAlert from 'app/appAlert';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';

let editPostApp: SetPostApp | null = null;

function hookUpEditBarEvents() {
  if (!appPageState.user) {
    return;
  }
  const editBarElement = document.getElementById(
    editBarID(entityPost, wind.EID),
  ) as EditBarApp | null;
  if (!editBarElement) {
    return;
  }
  editBarElement.addEventListener('deleteClick', async () => {
    if (await appAlert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      appAlert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(wind.EID, entityPost);
      const status = await appTask.critical(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
        pageUtils.setURL(status.data);
      }
    }
  });

  editBarElement.addEventListener('editClick', async () => {
    if (!editPostApp) {
      editPostApp = renderTemplateResult(
        '',
        html`<set-post-app
          .postID=${wind.EID}
          entityType=${entityPost}
          headerText=${ls.editPost}
        ></set-post-app>`,
      );
    }
    if (editPostApp) {
      editPostApp.open = true;
    }
  });
}

hookUpEditBarEvents();
