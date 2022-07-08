/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export function mediaQueryHandler(
  query: string,
  cb: (match: boolean) => void,
  listenOnly?: boolean,
) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', (e) => cb(e.matches));
  if (!listenOnly) {
    cb(mediaQuery.matches);
  }
}
