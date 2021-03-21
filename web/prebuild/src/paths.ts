/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

export function serverPath(path: string): string {
  return `../server/${path}`;
}

export function webPath(path: string): string {
  return `./${path}`;
}
