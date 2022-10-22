/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import ls, { formatLS, getLSByKey } from 'ls';
import { html } from 'll';
import { ready, renderTemplateResult } from 'lib/htmlLib';
import * as cmd from '../appCommands';
import { appdef } from '@qing/def';
import 'com/postCore/setEntityApp';
import SetEntityApp from 'com/postCore/setEntityApp';

const localizedStringSlotClass = '__qing_ls__';

// ---------------------------------
// Handle uncaught exceptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  // eslint-disable-next-line no-alert
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  // eslint-disable-next-line no-alert
  alert(`${ls.internalErr}: ${event.reason}`);
});

function handleLocalizedStringSlots() {
  const elements = document.getElementsByClassName(localizedStringSlotClass);
  for (const element of elements) {
    const key = element.textContent;
    if (key) {
      const { dataset } = element as HTMLElement;
      const params: string[] = [];
      if (dataset.lsArg1) {
        params.push(dataset.lsArg1);
      }
      if (dataset.lsArg2) {
        params.push(dataset.lsArg2);
      }
      if (dataset.lsArg3) {
        params.push(dataset.lsArg3);
      }
      const str = params.length ? formatLS(key, ...params) : getLSByKey(key);
      if (!str) {
        console.error(`Unresolved localized string key "${key}"`);
      }
      element.textContent = str;
    }
  }
}

ready(() => {
  // Handle localization slots left by server templates.
  handleLocalizedStringSlots();

  const cpYearEl = document.getElementById('main-cp-year');
  if (cpYearEl) {
    cpYearEl.textContent = new Date().getFullYear().toString();
  }

  // App commands.
  cmd.setCommand(cmd.AppCommands.newEntity, (arg) => {
    const [entityType, forumID] = arg as [number, string];
    let title: string;
    switch (entityType) {
      case appdef.contentBaseTypePost: {
        title = ls.newPost;
        break;
      }
      case appdef.contentBaseTypeFPost: {
        title = ls.newFPost;
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
