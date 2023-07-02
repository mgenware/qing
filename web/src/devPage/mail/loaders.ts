/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as mailAPI from '@qing/routes/dev/api/mail.js';
import { DevMail } from 'sod/dev/dev.js';

export class UsersLoader extends Loader<string[]> {
  override requestURL(): string {
    return mailAPI.users;
  }
}

export class InboxLoader extends Loader<DevMail[]> {
  constructor(public email: string) {
    super();
  }

  override requestParams() {
    return {
      email: this.email,
    };
  }

  override requestURL(): string {
    return mailAPI.inbox;
  }
}

export class MailLoader extends Loader<DevMail> {
  constructor(public email: string, public mailID: string) {
    super();
  }

  override requestParams() {
    return {
      email: this.email,
      id: this.mailID,
    };
  }

  override requestURL(): string {
    return mailAPI.get;
  }
}
