/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import CookieJar from 'helper/cookieJar';

it('CookieJar', () => {
  const jar = new CookieJar();
  jar.setCookies(['id=a3:fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT', 'id2=a13; Max-Age=2592000']);
  expect(jar.cookies()).toBe('id=a3%3AfWa;id2=a13');

  jar.setCookies(['id2=; Max-Age=2592000']);
  expect(jar.cookies()).toBe('id=a3%3AfWa;id2=');

  jar.setCookies(['id3=3; Max-Age=2592000']);
  expect(jar.cookies()).toBe('id=a3%3AfWa;id2=;id3=3');
});
