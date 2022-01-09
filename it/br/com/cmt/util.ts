import * as brt from 'brt';
import { User } from 'br';
import { editorShouldAppear, performUpdateEditor } from '../editor/editor';
import { getEditBarEditButton } from '../editor/editBar';
import { buttonShouldAppear } from '../buttons/button';

export interface PerformWriteCommentArgs {
  cmtApp: brt.Element;
  content: string;
}

export async function performWriteComment(p: brt.Page, e: PerformWriteCommentArgs, test: boolean) {
  const writeCmtBtn = await buttonShouldAppear(e.cmtApp.$('qing-button'), {
    text: 'Write a comment',
    style: 'success',
  });
  await writeCmtBtn.click();
  if (test) {
    await editorShouldAppear(p, {
      name: 'Write a comment',
      title: null,
      contentHTML: '',
      buttons: [{ text: 'Send', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await performUpdateEditor(p, { part: 'content', content: e.content });
}

export interface PerformEditCommentArgs {
  cmt: brt.Element;
  author: User;
  content: string;
  // Properties needed when `test` is true.
  contentHTMLTest?: string;
}

export async function performEditComment(p: brt.Page, e: PerformEditCommentArgs, test: boolean) {
  await getEditBarEditButton(e.cmt, e.author.id).click();
  if (test) {
    await editorShouldAppear(p, {
      name: 'Edit comment',
      title: null,
      contentHTML: e.contentHTMLTest ?? '',
      buttons: [{ text: 'Edit', style: 'success' }, { text: 'Cancel' }],
    });
  }

  await performUpdateEditor(p, { part: 'content', content: e.content });
}
