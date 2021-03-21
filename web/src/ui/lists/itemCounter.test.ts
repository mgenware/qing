/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './itemCounter';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<item-counter></item-counter>`);

  tDOM.isInlineElement(el);
});
