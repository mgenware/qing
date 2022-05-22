/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';

// Set FSP to 3 for DATETIME / DATE / TIME.
// By default MySQL uses 0.
const defaultFSP = 3;
mm.setDefaultDateFSP(defaultFSP);
mm.setDefaultDatetimeFSP(defaultFSP);
mm.setDefaultTimeFSP(defaultFSP);
