/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import appState from './appState';
import appStateName from './appStateName';
import User from './user/user';

interface MainWind {
  appUserID: string;
  appUserURL: string;
  appUserName: string;
  appUserIconURL: string;
  appLang: string;
  appForumsMode: boolean;
  appUserAdmin: boolean;
  appWindData: unknown;
}

function getMainPageWindData(): MainWind {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any) as MainWind;
}

appState.register(appStateName.user, () => {
  const wind = getMainPageWindData();
  if (wind.appUserID) {
    return {
      eid: wind.appUserID,
      name: wind.appUserName,
      url: wind.appUserURL,
      iconURL: wind.appUserIconURL,
      admin: wind.appUserAdmin,
    };
  }
  return null;
});

appState.register(appStateName.windData, () => {
  const wind = getMainPageWindData();
  return wind.appWindData ?? {};
});

appState.register(appStateName.forumsMode, () => {
  const wind = getMainPageWindData();
  return wind.appForumsMode;
});

export class AppPageState {
  get user(): User | null {
    return appState.get(appStateName.user);
  }

  windData<T>(): T {
    return appState.get(appStateName.windData);
  }

  get forumsMode(): boolean {
    return appState.get(appStateName.forumsMode);
  }

  // Helpers.
  get userEID(): string {
    const { user } = this;
    if (user) {
      return user.eid;
    }
    return '';
  }

  updateUser(part: Partial<User>) {
    const newUser = {
      ...this.user,
      ...part,
    };
    appState.set(appStateName.user, newUser);
  }
}

const appPageState = new AppPageState();
export default appPageState;
