/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import c from '../../constants.json';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(c.maxEmailLen).uniqueConstraint;
  name = mm.varChar(c.maxNameLen);
  icon_name = mm.varChar(c.maxFileNameLen).default('');
  created_at = mm.datetime('utc');
  status = mm.varChar(c.maxUserStatusLen).default('');

  company = mm.varChar(c.maxUserInfoFieldLen).default('');
  website = mm.varChar(c.maxURLLen).default('');
  location = mm.varChar(c.maxUserInfoFieldLen).default('');
  bio = mm.text().nullable.default(null);

  admin = mm.bool().default(false);
}

export default mm.table(User);
