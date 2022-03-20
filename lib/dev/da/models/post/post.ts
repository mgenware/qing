/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentWithTitleBase from '../com/contentWithTitleBase.js';

export class Post extends ContentWithTitleBase {}

export default mm.table(Post);
