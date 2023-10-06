/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appAlert from './appAlert.js';

// An extension of `AppAlert`, providing more utility functions.
export class AppAlertEx {
  async warnUnsavedChanges(): Promise<boolean> {
    return (
      (await appAlert.confirm(
        globalThis.coreLS.doYouWantDoDiscardYourChanges,
        globalThis.coreLS.youHaveNotSavedYourChanges,
      )) ?? false
    );
  }
}

const appAlertEx = new AppAlertEx();
export default appAlertEx;
