/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t.js';
import './langST';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<lang-st></lang-st>`);

  tDOM.isBlockElement(el);
});
