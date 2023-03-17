/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
import { ready } from 'lib/htmlLib.js';
import 'ui/lists/tabView.js';
import 'ui/alerts/noticeView.js';
import { tabViewActiveClass } from 'ui/lists/tabView.js';
import { appdef } from '@qing/def';
// Required by empty content view.
import 'ui/alerts/noContentView.js';

const defaultHighlightedTab = 'home';

ready(() => {
  // Highlight the selected tab.
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(appdef.keyTab);
  document
    .getElementById(`m-home-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);
});
