/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import voteTAFactory from './voteTAFactory.js';
import votableTables from '../../models/vote/votableTables.js';

const actions: mm.TableActions[] = [...votableTables.entries()].map(([hostTable, voteTable]) =>
  voteTAFactory(voteTable, hostTable),
);
export default actions;
