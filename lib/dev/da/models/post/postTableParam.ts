/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { Post } from './post.js';

export class PostTableParam extends Post {}

export default mm.table(PostTableParam, { tableParam: true });
