/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { ready } from 'lib/htmlLib';
import { keyTab } from 'sharedConstants';
import 'ui/content/headingView';
import 'ui/lists/tabView';
import { tabViewActiveClass } from 'ui/lists/tabView';

const defaultHighlightedTab = 'threads';

ready(() => {
  // Highlight the selected tab.
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(keyTab);
  document
    .getElementById(`m-forum-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);
});
