/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt } from '../cmt/cmt.js';
import ContentBase from './contentBase.js';

export default abstract class ContentBaseCmt extends mm.Table {
  // Comment ID.
  cmt_id = mm.pk(cmt.id);

  // Post ID.
  // In order to implement the same interface for all cmt-related tables,
  // we use a more generic name `host_id`.
  host_id: mm.Column;

  constructor() {
    super();
    this.host_id = mm.pk(this.getHostTable().id);
  }

  abstract getHostTable(): ContentBase;
}
