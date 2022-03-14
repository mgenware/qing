/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { appDef } from '@qing/def';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(appDef.maxEmailLen).uniqueConstraint;
  name = mm.varChar(appDef.maxNameLen);
  icon_name = mm.varChar(appDef.maxFileNameLen).default('');
  raw_created_at = mm.datetime({ defaultToNow: 'utc' }).setDBName('created_at');

  company = mm.varChar(appDef.maxUserInfoFieldLen).default('');
  website = mm.varChar(appDef.maxURLLen).default('');
  location = mm.varChar(appDef.maxUserInfoFieldLen).default('');
  bio = mm.text().nullable.default(null).setModelName('BioHTML');

  admin = mm.bool().default(0);
}

export default mm.table(User);
