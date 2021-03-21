/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import fmt from 'bowhead-js';
import LSDefs from 'lsDefs';

const windLS = (window as any).ls as LSDefs | undefined;
if (!windLS) {
  throw new Error('Localization file is not loaded');
}
export const ls = windLS;

export function formatLS(str: string, ...data: any[]): string {
  return fmt(str, ...data);
}

export function getLSByKey(key: string): string {
  return (ls as any)[key];
}

export default ls;
