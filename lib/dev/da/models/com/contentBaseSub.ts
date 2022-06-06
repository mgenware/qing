/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user.js';
import ContentBase from './contentBase.js';

export default abstract class ContentBaseSub extends mm.Table {
  user_id = mm.pk(user.id);
  target_id: mm.Column;

  constructor() {
    super();
    this.target_id = mm.pk(this.getSubTargetTable().id);
  }

  abstract getSubTargetTable(): ContentBase;
}
