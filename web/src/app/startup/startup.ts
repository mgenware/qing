/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html } from 'll.js';
import { ready, renderTemplateResult } from 'lib/htmlLib.js';
import * as cmd from '../appCommands.js';
import { appdef } from '@qing/def';
import 'com/postCore/setEntityApp';
import SetEntityApp from 'com/postCore/setEntityApp.js';

// ---------------------------------
// Handle uncaught exceptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  // eslint-disable-next-line no-alert
  alert(`${globalThis.coreLS.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  // eslint-disable-next-line no-alert
  alert(`${globalThis.coreLS.internalErr}: ${event.reason}`);
});

ready(() => {
  const cpYearEl = document.getElementById('main-cp-year');
  if (cpYearEl) {
    cpYearEl.textContent = new Date().getFullYear().toString();
  }

  // App commands.
  cmd.setCommand(cmd.AppCommands.newEntity, (arg) => {
    const [entityType, forumID] = arg as [number, string];
    let title: string;
    switch (entityType) {
      case appdef.ContentBaseType.post: {
        title = globalThis.coreLS.newPost;
        break;
      }
      case appdef.ContentBaseType.fPost: {
        title = globalThis.coreLS.newFPost;
        break;
      }
      default: {
        throw new Error(`Invalid entity type ${entityType}`);
      }
    }

    renderTemplateResult<SetEntityApp>(
      '',
      html`<set-entity-app
        .entityType=${entityType}
        .desc=${title}
        .forumID=${forumID}></set-entity-app>`,
    );
  });
});
