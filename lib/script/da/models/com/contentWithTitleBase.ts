/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from './contentBase.js';
import { appDef } from '@qing/def';

export default class ContentWithTitleBase extends ContentBase {
  title = mm.varChar(appDef.lenMaxTitle);
}
