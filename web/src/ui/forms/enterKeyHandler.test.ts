/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t.js';
import './enterKeyHandler';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<enter-key-handler></enter-key-handler>`);

  tDOM.isBlockElement(el);
});
