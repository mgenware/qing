/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appState from './appState';
import appStateName from './appStateName';
import { RawMainPageWind } from 'sod/app';
import { User } from 'sod/auth';

export interface MainPageWind extends RawMainPageWind {
  // See `window.appWindData` in `main.html` for details.
  appWindData: unknown;
}

function getMainPageWindData(): MainPageWind {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return window as any as MainPageWind;
}

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

appState.register<number>(appStateName.communityMode, () => {
  const wind = getMainPageWindData();
  return wind.appCommunityMode ?? 0;
});

appState.register<unknown>(appStateName.windData, () => {
  const wind = getMainPageWindData();
  return wind.appWindData ?? {};
});

export class AppPageState {
  get user(): User | null {
    return appState.get(appStateName.user);
  }

  windData<T>(): T {
    return appState.get(appStateName.windData);
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

  get communityMode(): number {
    return appState.get(appStateName.communityMode);
  }
}

const appPageState = new AppPageState();
export default appPageState;
