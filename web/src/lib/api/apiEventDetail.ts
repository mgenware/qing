/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Result from 'lib/result.js';

export default class APIEventDetail<T> {
  constructor(public done: (res: Result<T>) => void) {}
}
