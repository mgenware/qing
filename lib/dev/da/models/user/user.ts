/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { appdef } from '@qing/def';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(appdef.lenMaxEmail).uniqueConstraint;
  name = mm.varChar(appdef.lenMaxName);
  icon_name = mm.varChar(appdef.lenMaxFileName).default('');
  raw_created_at = mm.datetime({ defaultToNow: 'server' }).setDBName('created_at');

  company = mm.varChar(appdef.lenMaxUserInfoField).default('');
  website = mm.varChar(appdef.lenMaxURL).default('');
  location = mm.varChar(appdef.lenMaxUserInfoField).default('');
  bio = mm.text().nullable.default(null).setModelName('BioHTML');

  admin = mm.bool().default(0);
}

export default mm.table(User);
