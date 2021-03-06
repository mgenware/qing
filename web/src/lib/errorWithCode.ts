/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as sc from 'sharedConstants';

export default class ErrorWithCode extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number = sc.errGeneric) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
