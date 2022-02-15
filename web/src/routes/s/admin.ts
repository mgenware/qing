/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import root from './root.js';

const admin = `${root}/fmoadmind`;

export const setAdmin = `${admin}/set-admin`;
export const getAdmins = `${admin}/get-admins`;
export const getSiteSettings = `${admin}/get-site-settings`;
export const updateSiteSettings = `${admin}/update-site-settings`;
