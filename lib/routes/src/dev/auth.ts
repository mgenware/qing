/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import root from './root.js';

// This file contains the GET routes for user login and logout used in BR tests.
export const authRoot = `${root}/auth`;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const in_ = `${authRoot}/in`;
export const out = `${authRoot}/out`;
