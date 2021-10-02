/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as ll from 'll';
import routes from './devRoutes';
import './devView';
import './auth/authDevPage';
import './ui/elementsDev';
import { routeDevPage } from 'sharedConstants';
import pageUtils from 'app/utils/pageUtils';

const devRouter = new MiniURLRouter();

function loadPageContent(title: string, content: ll.TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [title],
    ll.html` <container-view> ${content} </container-view> `,
  );
}

devRouter.register(routes.authRoot, () => {
  loadPageContent('Auth dev page', ll.html`<auth-dev-page></auth-dev-page>`);
});
devRouter.register(routes.elements, () => {
  loadPageContent('Elements dev page', ll.html`<elements-dev></elements-dev>`);
});

devRouter.register(`/${routeDevPage}`, () => {
  loadPageContent('Dev page', ll.html` <dev-view></dev-view>`);
});

devRouter.startOnce();
