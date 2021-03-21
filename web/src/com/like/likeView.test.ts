/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'qing-t';
import './likeView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<like-view></like-view>`);

  tDOM.isInlineBlockElement(el);
});
