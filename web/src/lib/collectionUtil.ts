/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export function toggleSetMember<T>(from: Set<T>, item: T, copy: boolean) {
  const s = copy ? new Set<T>(from) : from;
  if (s.has(item)) {
    s.delete(item);
  } else {
    s.add(item);
  }
  return s;
}
