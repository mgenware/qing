/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { MiniURLRouter } from 'lib/miniURLRouter';
import { html, TemplateResult } from 'll';
import * as topRoute from './routes/top';
import './devPage';
import { routeDevPage } from 'sharedConstants';
import './auth/authPage';
import './ui/elementsPage';
import pageUtils from 'app/utils/pageUtils';

const devRouter = new MiniURLRouter();

function loadPageContent(title: string, content: TemplateResult) {
  pageUtils.setTitleAndMainContent([title], html`<container-view>${content}</container-view>`);
}

devRouter.register(topRoute.auth, () => {
  loadPageContent('Auth dev page', html`<auth-page></auth-page>`);
});
devRouter.register(topRoute.elements, () => {
  loadPageContent('Elements dev page', html`<elements-page></elements-page>`);
});

devRouter.register(`/${routeDevPage}`, () => {
  loadPageContent('Dev page', html` <dev-page></dev-page>`);
});

devRouter.startOnce();
