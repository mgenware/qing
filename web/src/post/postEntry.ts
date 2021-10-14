/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import './postPayloadApp';
import { setupHandlers } from 'com/postCore/postEditHandlers';
import { PostUserApp } from 'com/postCore/postUserApp';
import { entityPost } from 'sharedConstants';
import wind from './postWind';

const postUserApp = document.querySelector<PostUserApp>('.m-post-user');
if (postUserApp) {
  setupHandlers(postUserApp, wind.EID, entityPost);
}
