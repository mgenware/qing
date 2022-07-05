/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';

export const localizedErrDict = new Map<number, string>();
localizedErrDict.set(appdef.errNeedAuth, 'needAuthErr');
localizedErrDict.set(appdef.errCaptchaNotFound, 'captNotFoundErr');
localizedErrDict.set(appdef.errCaptchaNotMatch, 'captNotMatch');

export class Cookies {
  // "Local" indicates that server is not aware of this cookie.
  static themeKey = 'local_user_theme';
}

export enum UserTheme {
  light = 0,
  dark,
  device,
}
