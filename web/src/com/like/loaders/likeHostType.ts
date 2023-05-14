/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { frozenDef } from '@qing/def';

enum LikeHostType {
  post = frozenDef.ContentBaseType.post,
  cmt = frozenDef.ContentBaseType.cmt,
}

export default LikeHostType;
