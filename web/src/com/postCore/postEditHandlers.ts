/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'ui/editor/editBarApp';
import { html } from 'll';
import { ls, formatLS } from 'ls';
import appPageState from 'app/appPageState';
import appAlert from 'app/appAlert';
import { EditBarApp } from 'ui/editor/editBarApp';
import { entityTypeToLS } from './strings';
import DeleteEntityLoader from './loaders/deleteEntityLoader';
import 'com/postCore/setEntityApp';
import SetEntityApp from 'com/postCore/setEntityApp';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';
import { renderTemplateResult } from 'lib/htmlLib';
import Entity from 'lib/entity';

export function setupHandlers(
  editBarElement: EditBarApp,
  entity: Entity,
  forumID: string | undefined,
) {
  if (!appPageState.user) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  editBarElement.addEventListener('deleteClick', async () => {
    if (
      await appAlert.confirm(
        ls.warning,
        formatLS(ls.pDoYouWantToDeleteThis, entityTypeToLS(entity.type)),
      )
    ) {
      appAlert.showLoadingOverlay(ls.working);
      const loader = new DeleteEntityLoader(entity);
      const status = await appTask.critical(loader, ls.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
        pageUtils.setURL(status.data);
      }
    }
  });

  editBarElement.addEventListener('editClick', () => {
    const editPostApp = renderTemplateResult<SetEntityApp>(
      '',
      html`<set-entity-app
        autoClose
        .postID=${entity.id}
        .forumID=${forumID || ''}
        entityType=${entity.type}
        headerText=${formatLS(ls.pEditEntity, entityTypeToLS(entity.type))}></set-entity-app>`,
    );
    if (editPostApp) {
      editPostApp.open = true;
    }
  });
}
