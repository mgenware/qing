import 'ui/editor/editBarApp';
import { CHECK } from 'checks';
import { EditBarApp } from 'ui/editor/editBarApp';
import { entityQuestion } from 'sharedConstants';
import { setupHandlers } from 'com/postCore/postEditHandlers';

const eidAttr = 'eid';

export function getQueIDFromPage(): string | null {
  // There should only be one question-app per page.
  const queApp = document.getElementsByTagName('question-app')[0];
  if (!queApp) {
    return null;
  }
  return queApp.getAttribute(eidAttr);
}

export function hookUpQueAppEditorEvents() {
  const queID = getQueIDFromPage();
  CHECK(queID);
  const editBar = document.querySelector<EditBarApp>('question-app edit-bar-app');
  if (editBar) {
    setupHandlers(editBar, queID, entityQuestion);
  }
}
