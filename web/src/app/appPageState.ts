/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';
import appState from './appState.js';
import appStateName from './appStateName.js';
import { RawMainPageWind } from 'sod/app.js';
import { User } from 'sod/auth.js';

export interface MainPageWind extends RawMainPageWind {
  // See `window.appWindData` in `main.html` for details.
  appWindData: unknown;
}

function getMainPageWindData(): MainPageWind {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return window as any as MainPageWind;
}

/**
 * Please only register things that might change at runtime.
 */

appState.register<User | null>(appStateName.user, () => {
  const wind = getMainPageWindData();
  if (wind.appUserID) {
    return {
      id: wind.appUserID,
      name: wind.appUserName ?? '',
      link: wind.appUserURL ?? '',
      iconURL: wind.appUserIconURL ?? '',
      admin: wind.appUserAdmin,
    };
  }
  return null;
});

export class AppPageState {
  get user(): User | null {
    return appState.get(appStateName.user);
  }

  windData<T>(): T {
    const wind = getMainPageWindData();
    return wind.appWindData as T;
  }

  get userID(): string | undefined {
    return this.user?.id;
  }

  updateUser(part: Partial<User>) {
    const newUser = {
      ...this.user,
      ...part,
    };
    appState.set(appStateName.user, newUser);
  }

  get postPerm(): appdef.PostPermission {
    const wind = getMainPageWindData();
    return wind.appPostPerm as appdef.PostPermission;
  }

  get forums(): boolean {
    const wind = getMainPageWindData();
    return wind.appForums ?? false;
  }
}

const appPageState = new AppPageState();
export default appPageState;
