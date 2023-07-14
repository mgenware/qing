/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
// Used in profile post list.
import { ready } from 'lib/htmlLib.js';
import 'ui/lists/tabView.js';
import { tabViewActiveClass } from 'ui/lists/tabView.js';
import delay from 'lib/delay.js';
import 'ui/widgets/tagView.js';
import { appDef } from '@qing/def';
import './views/profileIDView';
// Required by empty content view.
import 'ui/alerts/noContentView.js';
import profilePageState from './profilePageState.js';

const defaultHighlightedTab = appDef.keyPosts;
const qingLSCls = '__qing_ls__';

// Update localized strings.
document.querySelectorAll<HTMLElement>(`.${qingLSCls}`).forEach((el) => {
  if (el.textContent) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign, @typescript-eslint/no-explicit-any
    el.textContent = (globalThis.coreLS as any)[el.textContent];

    el.classList.remove(qingLSCls);
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
ready(async () => {
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(appDef.keyTab);
  const page = qs.get(appDef.keyPage);

  // Scroll to feed list tab if `tab` or `page` are present.
  if (tab || page) {
    await delay(500);
    document.getElementById('m-profile-posts')?.scrollIntoView(true);
  }

  // Highlight a tab in tab view.
  document
    .getElementById(`m-profile-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);

  // Set user URL.
  const { Website: website } = profilePageState;
  if (website) {
    document
      .getElementById('m-profile-url')
      ?.setAttribute('href', website.includes('://') ? website : `http://${website}`);
  }
});
