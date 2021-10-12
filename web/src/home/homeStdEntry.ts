/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { injectStyles, ready } from 'lib/htmlLib';
import 'ui/lists/tabView';
import 'ui/alerts/noticeView';
import { tabViewActiveClass } from 'ui/lists/tabView';
import { css } from 'll';
import { keyTab } from 'sharedConstants';
// Required by empty content view.
import 'ui/alerts/noContentView';

const defaultHighlightedTab = 'home';

const styles = css`
  .item-title {
    font-size: 1.3rem;
  }
`;
injectStyles([styles]);

ready(() => {
  // Highlight the selected tab.
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(keyTab);
  document
    .getElementById(`m-home-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);
});
