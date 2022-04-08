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
import './devPage';
import { appdef } from '@qing/def';
import './auth/authPage';
import './ui/elementsPage';
import pageUtils from 'app/utils/pageUtils';

const devRouter = new MiniURLRouter();

function loadPageContent(title: string, content: TemplateResult) {
  pageUtils.setTitleAndMainContent([title], html`<container-view>${content}</container-view>`);
}

devRouter.register(authRoute.authRoot, () => {
  loadPageContent('Auth dev page', html`<auth-page></auth-page>`);
});
devRouter.register(elementsRoute.elementsRoot, () => {
  loadPageContent('Elements dev page', html`<elements-page></elements-page>`);
});

devRouter.register(`/${appdef.routeDev}`, () => {
  loadPageContent('Dev page', html` <dev-page></dev-page>`);
});

devRouter.startOnce();
