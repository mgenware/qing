import { ready } from 'lib/htmlLib';
import 'ui/content/headingView';
import 'ui/lists/tabView';

const forumEditBtnID = 'm-forum-edit-btn';

ready(() => {
  const editButton = document.getElementById(forumEditBtnID);
  editButton?.addEventListener('click', () => {});
});
