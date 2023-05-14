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
  email = mm.varChar(appDef.lenMaxEmail).uniqueConstraint;
  name = mm.varChar(appDef.lenMaxName);
  icon_name = mm.varChar(appDef.lenMaxFileName).default('');
  raw_created_at = mm.datetime({ defaultToNow: 'server' }).setDBName('created_at');

  company = mm.varChar(appDef.lenMaxUserInfoField).default('');
  website = mm.varChar(appDef.lenMaxURL).default('');
  location = mm.varChar(appDef.lenMaxUserInfoField).default('');
  bio = mm.text().nullable.default(null).setModelName('BioHTML');
  lang = mm.varChar(appDef.lenMaxLang).default('');
  reg_lang = mm.varChar(appDef.lenMaxLang);

  admin = mm.bool().default(0);
}

export default mm.table(User);
