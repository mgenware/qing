/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t';
import './selectView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<select-view></select-view>`);

  tDOM.isBlockElement(el);
});
