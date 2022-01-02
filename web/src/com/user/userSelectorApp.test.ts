/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, fixture, tDOM } from 'dev/t';
import './userSelectorApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<user-selector-app></user-selector-app>`);

  tDOM.isBlockElement(el);
});
