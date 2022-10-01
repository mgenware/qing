/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as mailsAPI from '@qing/routes/d/dev/api/mails';

export interface DevMail {
  title?: string;
  ts?: number;
  content?: string;
  dirName: string;
}

export class UsersLoader extends Loader<string[]> {
  override requestURL(): string {
    return mailsAPI.users;
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
    return mailsAPI.inbox;
  }
}

export class MailLoader extends Loader<DevMail> {
  constructor(public email: string, public dirName: string) {
    super();
  }

  override requestParams() {
    return {
      email: this.email,
      dirName: this.dirName,
    };
  }

  override requestURL(): string {
    return mailsAPI.get;
  }
}
