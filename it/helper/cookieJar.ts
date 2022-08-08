/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import scp from 'set-cookie-parser';
import Cookie from 'cookie';

// node-fetch doesn't persist cookies.
// Use this helper to persist cookies among node-fetch requests.
// NOTE: No expiry support.
export default class CookieJar {
  #cookies: scp.CookieMap = {};

  setCookies(setCookies: string[] | undefined) {
    if (!setCookies) {
      return;
    }
    const cookies = scp.parse(setCookies, { map: true });
    Object.assign(this.#cookies, cookies);
  }

  cookies() {
    return Object.entries(this.#cookies)
      .map(([k, v]) => Cookie.serialize(k, v.value))
      .join(';');
  }
}
