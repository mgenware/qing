/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import ls, { formatLS, getLSByKey } from 'ls';
import coreStyles from 'app/styles/bundle';
import { CSSResult, html } from 'll';
import { injectStyles, ready, renderTemplateResult } from 'lib/htmlLib';
import appSettings from 'app/appSettings';
import { localizedErrDict } from 'defs';
import Loader from 'lib/loader';
import * as cmd from '../appCommands';
import { entityDiscussion, entityPost, entityQuestion } from 'sharedConstants';
import 'com/postCore/setPostApp';
import SetPostApp from 'com/postCore/setPostApp';
import { CHECK } from 'checks';

const localizedStringSlotClass = '__qing_ls__';

// ---------------------------------
// Handle uncaught exceptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  // eslint-disable-next-line no-alert
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

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
  // Set global error messages to loader type.
  Loader.defaultLocalizedMessageDict = localizedErrDict;

  // Apply necessary settings.
  appSettings.applySettings();

  // Make core styles cross all shadow roots.
  injectStyles(coreStyles as CSSResult[]);

  // Handle localization slots left by server templates.
  handleLocalizedStringSlots();

  // App commands.
  cmd.setCommand(cmd.AppCommands.newEntity, (arg) => {
    const [entityType, forumID] = arg as [number, string];
    let title: string;
    switch (entityType) {
      case entityPost: {
        title = ls.newPost;
        break;
      }
      case entityDiscussion: {
        title = ls.newDiscussion;
        break;
      }
      case entityQuestion: {
        title = ls.newQuestion;
        break;
      }
      default: {
        throw new Error(`Invalid entity type ${entityType}`);
      }
    }

    const app = renderTemplateResult<SetPostApp>(
      '',
      html`<set-post-app
        open
        .entityType=${entityType}
        .headerText=${title}
        .forumID=${forumID}
      ></set-post-app>`,
    );
    CHECK(app);
    app.open = true;
  });
});
