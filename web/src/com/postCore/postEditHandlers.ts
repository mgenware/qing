/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'ui/editing/editBarApp';
import { html } from 'll.js';
import appPageState from 'app/appPageState.js';
import appAlert from 'app/appAlert.js';
import appSpinner from 'app/appSpinner.js';
import { EditBarApp } from 'ui/editing/editBarApp.js';
import { entityTypeToLS } from './strings.js';
import DeleteEntityLoader from './loaders/deleteEntityLoader.js';
import 'com/postCore/setEntityApp';
import SetEntityApp from 'com/postCore/setEntityApp.js';
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';
import { renderTemplateResult } from 'lib/htmlLib.js';
import Entity from 'lib/entity.js';
import strf from 'bowhead-js';

export function setupHandlers(
  editBarElement: EditBarApp,
  entity: Entity,
  forumID: string | undefined,
) {
  if (!appPageState.user) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  editBarElement.addEventListener('edit-bar-delete-click', async () => {
    if (
      await appAlert.confirm(
        globalThis.coreLS.warning,
        strf(globalThis.coreLS.pDoYouWantToDeleteThis, entityTypeToLS(entity.type)),
      )
    ) {
      appSpinner.showLoadingOverlay(globalThis.coreLS.working);
      const loader = new DeleteEntityLoader(entity);
      const status = await appTask.critical(loader, globalThis.coreLS.working);
      if (status.data) {
        // Redirect to profile page since this page has been deleted.
        pu.setURL(status.data);
      }
    }
  });

  editBarElement.addEventListener('edit-bar-edit-click', () => {
    renderTemplateResult<SetEntityApp>(
      '',
      html`<set-entity-app
        .desc=${strf(globalThis.coreLS.pEditEntity, entityTypeToLS(entity.type))}
        .entityID=${entity.id}
        .entityType=${entity.type}
        .forumID=${forumID || ''}></set-entity-app>`,
    );
  });
}
