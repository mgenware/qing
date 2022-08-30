/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
// Used in profile post list.
import { ready } from 'lib/htmlLib';
import 'ui/lists/tabView';
import { tabViewActiveClass } from 'ui/lists/tabView';
import delay from 'lib/delay';
import 'ui/widgets/tagView';
import { appdef } from '@qing/def';
import './views/profileIDView';
// Required by empty content view.
import 'ui/alerts/noContentView';
import profileWind from './profileWind';

const defaultHighlightedTab = appdef.keyPosts;

// eslint-disable-next-line @typescript-eslint/no-misused-promises
ready(async () => {
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(appdef.keyTab);
  const page = qs.get(appdef.keyPage);

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
  const { Website: website } = profileWind;
  if (website) {
    document
      .getElementById('m-profile-url')
      ?.setAttribute('href', website.includes('://') ? website : `http://${website}`);
  }
});
