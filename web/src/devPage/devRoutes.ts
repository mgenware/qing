/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import buildTree from 'fx214';

const routes = buildTree({
  __: {
    elements: 'elements',
    auth: 'auth',
    // GET routes used in auth page.
    authGetApi: {
      createUser: 'create-user',
      in: 'in',
      out: 'out',
    },
  },
});

export default routes.__;
