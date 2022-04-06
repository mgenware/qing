/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'ui/editor/editBarApp';
import { EditBarApp } from 'ui/editor/editBarApp';
import { appdef } from '@qing/def';
import wind from './threadWind';
import { setupHandlers } from 'com/postCore/postEditHandlers';

export function hookUpQueAppEditorEvents() {
  const editBar = document.querySelector<EditBarApp>('thread-app edit-bar-app');
  if (editBar) {
    setupHandlers(editBar, { id: wind.threadID, type: appdef.contentBaseTypeThread }, wind.forumID);
  }
}
