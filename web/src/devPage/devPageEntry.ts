/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
import { MiniURLRouter } from 'lib/miniURLRouter.js';
import { html, TemplateResult } from 'll.js';
import * as authRoute from '@qing/routes/dev/auth.js';
import * as devRoot from '@qing/routes/dev/root.js';
import * as mailRoute from '@qing/routes/dev/mail.js';
import './devPage';
import { appDef } from '@qing/def';
import './auth/authPage';
import './ui/elementsPage';
import './sendRealMail/sendRealMailPage.js';
import './mail/mbUsersPage';
import './mail/mbInboxPage';
import './mail/mbMailPage';
import * as pu from 'lib/pageUtil.js';

const devRouter = new MiniURLRouter();

function mustGetString(v: unknown) {
  if (typeof v === 'string') {
    return v;
  }
  throw new Error(`String value required. Got "${v}"`);
}

function loadPageContent(title: string, content: TemplateResult) {
  pu.setTitleAndMainContent([title], content);
}

devRouter.register(authRoute.authRoot, () => {
  loadPageContent('Auth dev page', html`<auth-page></auth-page>`);
});
devRouter.register(devRoot.elements, () => {
  loadPageContent('Elements dev page', html`<elements-page></elements-page>`);
});
devRouter.register(devRoot.sendRealMail, () => {
  loadPageContent('Send real mails', html`<send-real-mail-page></send-real-mail-page>`);
});

devRouter.register(mailRoute.users, () => {
  loadPageContent('Mail - Users', html` <mb-users-page></mb-users-page>`);
});
devRouter.register(`${mailRoute.inbox}/:email`, (args) => {
  loadPageContent('Mail - Inbox', html` <mb-inbox-page .email=${args.email}></mb-inbox-page>`);
});
devRouter.register(`${mailRoute.mail}/:email/:dirName`, (args) => {
  loadPageContent(
    'Mail',
    html` <mb-mail-page
      .email=${mustGetString(args.email)}
      .dirName=${mustGetString(args.dirName)}></mb-mail-page>`,
  );
});

// Root dev entry.
devRouter.register(`/${appDef.routeDev}`, () => {
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
