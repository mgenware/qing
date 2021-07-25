/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { formatLS, ls } from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'll';
import { editBarID, EditBarApp } from 'ui/editor/editBarApp';
// NOTE: `edit-bar-app` is required as it's being used by post page template.
import 'ui/editor/editBarApp';
import DeletePostLoader from './loaders/deletePostLoader';
import './setPostApp';
import SetPostApp from './setPostApp';
import appPageState from 'app/appPageState';
import appAlert from 'app/appAlert';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';
import { CHECK } from 'checks';

let editPostApp: SetPostApp | null = null;

export function hookUpEditBarEvents(eid: string, entityType: number) {
  if (!appPageState.user) {
    return;
  }
  const editBarElement = document.getElementById(editBarID(entityType, eid)) as EditBarApp | null;
  if (!editBarElement) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  editBarElement.addEventListener('deleteClick', async () => {
    if (await appAlert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      appAlert.showLoadingOverlay(ls.working);
      const loader = new DeletePostLoader(eid, entityType);
      const status = await appTask.critical(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
        pageUtils.setURL(status.data);
      }
    }
  });

  editBarElement.addEventListener('editClick', () => {
    if (!editPostApp) {
      editPostApp = renderTemplateResult(
        '',
        html`<set-post-app
          .postID=${eid}
          entityType=${entityType}
          headerText=${ls.editPost}
        ></set-post-app>`,
      );
    }
    CHECK(editPostApp);
    editPostApp.open = true;
  });
}
