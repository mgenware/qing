/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ass from '../ass.js';

/**
 * @param {*} r
 */
export function notAuthorized(r) {
  ass.de(r, { code: 10001 });
}
