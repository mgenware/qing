/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from './contentBase.js';

export class ContentBaseUtil extends ContentBase {}

export default mm.table(ContentBaseUtil, { virtualTable: true });
