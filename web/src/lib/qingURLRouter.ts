/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { MiniURLRouter } from './miniURLRouter.js';
import * as pu from './pageUtil.js';
import { html } from 'll.js';

// Extends MiniURLRouter to provide a default 404 page.
export default class QingURLRouter extends MiniURLRouter {
  constructor() {
    super(() => {
      pu.setMainContent(html`<h2 class="text-center m-t-lg">${globalThis.coreLS.resNotFound}</h2>`);
    });
  }
}
