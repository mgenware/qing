/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import appPageState from 'app/appPageState';

export interface LangInfo {
  Name: string;
  ID: string;
  LocalizedName: string;
}

export interface LangWindData {
  Langs: LangInfo[];
}

export default appPageState.windData<LangWindData>();
