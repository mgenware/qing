/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'qing-t';
import './elementsPage';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<elements-page></elements-page>`);

  tDOM.isInlineElement(el);
});
