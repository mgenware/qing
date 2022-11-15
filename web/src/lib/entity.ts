/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appdef } from '@qing/def';

export default interface Entity {
  type: appdef.ContentBaseType;
  id: string;
}
