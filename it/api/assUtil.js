/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ass from '../ass.js';

/**
 * @param {*} data
 */
export function notAuthorized(data) {
  ass.de(data, { code: 10001, message: 'Error code: 10001' });
}
