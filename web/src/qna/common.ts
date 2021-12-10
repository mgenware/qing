/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'ui/editor/editBarApp';
import { EditBarApp } from 'ui/editor/editBarApp';
import { entityQuestion } from 'sharedConstants';
import wind from './qnaWind';
import { setupHandlers } from 'com/postCore/postEditHandlers';

export function hookUpQueAppEditorEvents() {
  const editBar = document.querySelector<EditBarApp>('question-app edit-bar-app');
  if (editBar) {
    setupHandlers(editBar, wind.questionID, wind.forumID, entityQuestion);
  }
}
