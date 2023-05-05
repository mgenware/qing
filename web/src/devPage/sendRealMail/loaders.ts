/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as mailsAPI from '@qing/routes/dev/api/mails.js';

export interface SendMailLoaderArgs {
  to: string;
  title: string;
  content: string;
  forceProd?: number;
}

export class SendRealMailLoader extends Loader<void> {
  constructor(public args: SendMailLoaderArgs) {
    super();
  }

  override requestURL(): string {
    return mailsAPI.sendRealMail;
  }

  override requestParams() {
    return { ...this.args };
  }
}
