/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t.js';
import './mdEditor.js';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<md-editor></md-editor>`);

  tDOM.isFlexElement(el);
});
