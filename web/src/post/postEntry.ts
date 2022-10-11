/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
// Used by post page template.
import 'com/postCore/postUserApp';
import './postPayloadApp';
import { setupHandlers } from 'com/postCore/postEditHandlers';
import 'ui/editing/editBarApp';
import { EditBarApp } from 'ui/editing/editBarApp';
import { appdef } from '@qing/def';
import wind from './postWind';

const editBar = document.querySelector<EditBarApp>('.m-post-user edit-bar-app');
if (editBar) {
  setupHandlers(editBar, { id: wind.id, type: appdef.contentBaseTypePost }, undefined);
}
