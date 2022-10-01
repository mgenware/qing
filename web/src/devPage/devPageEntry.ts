/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { MiniURLRouter } from 'lib/miniURLRouter';
import { html, TemplateResult } from 'll';
import * as authRoute from '@qing/routes/d/dev/auth';
import * as elementsRoute from '@qing/routes/d/dev/elements';
import * as mailsRoute from '@qing/routes/d/dev/mails';
import './devPage';
import { appdef } from '@qing/def';
import './auth/authPage';
import './ui/elementsPage';
import './mails/mbUsersPage';
import './mails/mbInboxPage';
import './mails/mbMailPage';
import * as pu from 'lib/pageUtil';

const devRouter = new MiniURLRouter();

function loadPageContent(title: string, content: TemplateResult) {
  pu.setTitleAndMainContent([title], content);
}

devRouter.register(authRoute.authRoot, () => {
  loadPageContent('Auth dev page', html`<auth-page></auth-page>`);
});
devRouter.register(elementsRoute.elementsRoot, () => {
  loadPageContent('Elements dev page', html`<elements-page></elements-page>`);
});

devRouter.register(mailsRoute.users, () => {
  loadPageContent('Mails - Users', html` <mb-users-page></mb-users-page>`);
});
devRouter.register(`${mailsRoute.inbox}/:email`, (args) => {
  loadPageContent('Mails - Inbox', html` <mb-inbox-page .email=${args.email}></mb-inbox-page>`);
});
devRouter.register(`${mailsRoute.mail}/:email/:dirName`, (args) => {
  console.log(' --- ', args);
  loadPageContent(
    'Mails - Mail',
    html` <mb-mail-page .email=${args.email} .dirName=${args.dirName}></mb-mail-page>`,
  );
});

// Root dev entry.
devRouter.register(`/${appdef.routeDev}`, () => {
  loadPageContent('Dev page', html` <dev-page></dev-page>`);
});

if (!devRouter.startOnce()) {
  loadPageContent(
    '404',
    html`<div>
      <h1>404</h1>
      <p>Not a valid dev page.</p>
    </div>`,
  );
}
