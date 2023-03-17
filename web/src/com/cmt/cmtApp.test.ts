/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t.js';
import './cmtApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-app></cmt-app>`);

  tDOM.isBlockElement(el);
});
