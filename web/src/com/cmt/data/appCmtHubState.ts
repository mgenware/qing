/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import appState from 'app/appState';
import appStateName from 'app/appStateName';
import { CmtDataHub } from './cmtDataHub';

export class AppCmtHubState {
  setHub(hostType: number, hostID: string, hub: CmtDataHub) {
    appState.set(appStateName.getCmtHub(hostType, hostID), hub);
  }

  getHub(hostType: number, hostID: string): CmtDataHub | undefined {
    return appState.get(appStateName.getCmtHub(hostType, hostID));
  }
}

const appCmtHubState = new AppCmtHubState();
export default appCmtHubState;
