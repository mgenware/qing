/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
// Used by post page template.
import 'com/postCore/postUserApp.js';
import './postPayloadApp.js';
import { setupHandlers } from 'com/postCore/postEditHandlers.js';
import 'ui/editing/editBarApp';
import { EditBarApp } from 'ui/editing/editBarApp.js';
import { frozenDef } from '@qing/def';
import wind from './postWind.js';

const editBar = document.querySelector<EditBarApp>('.m-post-user edit-bar-app');
if (editBar) {
  setupHandlers(editBar, { id: wind.id, type: frozenDef.ContentBaseType.post }, undefined);
}
