/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { frozenDef } from '@qing/def';
import appState from './appState.js';
import appStateName from './appStateName.js';
import { MainPageStateData } from 'sod/app.js';
import { User } from 'sod/auth.js';

export interface MainPageScriptVars {
  appPageState: MainPageStateData;
  appPageExtra: unknown;
}

function getMainPageScriptVars(): MainPageScriptVars {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return window as any as MainPageScriptVars;
}

function getMainPageState(): MainPageStateData {
  return getMainPageScriptVars().appPageState;
}

/**
 * Please only register things that might change at runtime.
 */
appState.register<User | null>(appStateName.user, () => getMainPageState().user ?? null);

export class AppPageState {
  get user(): User | null {
    return appState.get(appStateName.user);
  }

  extraData<T>(): T {
    return getMainPageScriptVars().appPageExtra as T;
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

  get postPerm(): frozenDef.PostPermissionConfig {
    return getMainPageState().postPerm as frozenDef.PostPermissionConfig;
  }

  get forums(): boolean {
    return !!getMainPageState().forums;
  }
}

const appPageState = new AppPageState();
export default appPageState;
