/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t.js';
import './siteGeneralST';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<site-general-st></site-general-st>`);

  tDOM.isBlockElement(el);
});
