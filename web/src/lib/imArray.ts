/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { pureArrayInsertAt, pureArrayRemoveAt, pureArraySet } from 'f-array.splice';

export function append<T>(arr: readonly T[], ...items: T[]) {
  return [...arr, ...items];
}

export function prepend<T>(arr: readonly T[], ...items: T[]) {
  return [...items, ...arr];
}

export function insertAt<T>(arr: readonly T[], idx: number, ...items: T[]) {
  return pureArrayInsertAt(arr, idx, ...items);
}

export function removeAt<T>(arr: readonly T[], idx: number) {
  return pureArrayRemoveAt(arr, idx);
}

export function setAt<T>(arr: readonly T[], idx: number, item: T) {
  return pureArraySet(arr, idx, item);
}
