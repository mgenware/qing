/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'ui/editor/editBarApp';
import { CHECK } from 'checks';
import { EditBarApp } from 'ui/editor/editBarApp';
import { entityQuestion } from 'sharedConstants';
import { QuestionApp } from './questionApp';
import { setupHandlers } from 'com/postCore/postEditHandlers';

const eidAttr = 'eid';
const forumIDAttr = 'forumID';

export function getQueAppEl(): QuestionApp {
  // There should only be one question-app per page.
  const queApp = document.getElementsByTagName('question-app')[0];
  CHECK(queApp);
  return queApp;
}

export function hookUpQueAppEditorEvents() {
  const queAppEl = getQueAppEl();
  const queID = queAppEl.getAttribute(eidAttr);
  CHECK(queID);
  const editBar = document.querySelector<EditBarApp>('question-app edit-bar-app');
  if (editBar) {
    setupHandlers(editBar, queID, queAppEl.getAttribute(forumIDAttr), entityQuestion);
  }
}
