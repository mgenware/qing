/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import likeTAFactory from './likeTAFactory.js';
import likeableTables from '../../models/like/likeableTables.js';

const actions: mm.TableActions[] = [...likeableTables.entries()].map(([hostTable, likeTable]) =>
  likeTAFactory(likeTable, hostTable),
);
export default actions;
