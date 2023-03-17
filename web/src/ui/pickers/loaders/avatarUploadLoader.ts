/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import FileUploadLoader from 'lib/fileUploadLoader.js';
import * as profileRoute from '@qing/routes/s/pri/profile.js';

export interface AvatarUploadResponse {
  iconL?: string;
  iconS?: string;
}

export default class AvatarUploadLoader extends FileUploadLoader<AvatarUploadResponse> {
  override requestURL(): string {
    return profileRoute.setAvatar;
  }
}
