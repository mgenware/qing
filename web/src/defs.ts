/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as sc from './sharedConstants';

export const localizedErrDict = new Map<number, string>();
localizedErrDict.set(sc.errNeedAuth, 'needAuthErr');
localizedErrDict.set(sc.errCaptchaNotFound, 'captNotFoundErr');
localizedErrDict.set(sc.errCaptchaNotMatch, 'captNotMatch');

export class Cookies {
  // "Local" indicates that server is not aware of this cookie.
  static themeKey = 'local_user_theme';
}

export enum UserTheme {
  light = 0,
  dark,
}
