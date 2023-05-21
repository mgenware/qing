/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export function closedImmersiveSel(sel: string) {
  return `${sel} qing-overlay.immersive:not[open]`;
}

export function openImmersiveSel(sel: string) {
  return `${sel} qing-overlay.immersive[open=""]`;
}

export function closedSel(sel: string) {
  return `${sel} qing-overlay:not[open]`;
}

export function openSel(sel: string) {
  return `${sel} qing-overlay[open=""]`;
}
