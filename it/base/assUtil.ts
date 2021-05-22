/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ass from './ass';
import { APIResult } from './post.js';

export function notAuthorized(r: APIResult) {
  ass.de(r, { code: 10001 });
}

export function rowNotUpdated(r: APIResult) {
  ass.de(r, { code: 10000, message: 'Expected 1 rows affected, got 0.' });
}
