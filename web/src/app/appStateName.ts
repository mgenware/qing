/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export class AppStateName {
  user = 'user';
  private cmtHub = 'cmtHub';

  getCmtHub(type: number, id: string): string {
    return `${this.cmtHub}-${type}-${id}`;
  }
}

const appStateName = new AppStateName();
export default appStateName;
