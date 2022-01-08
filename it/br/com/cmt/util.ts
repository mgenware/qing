import * as brt from 'brt';
import { editorShouldAppear, editorShouldUpdate } from '../editor/editor';
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

  await editorShouldUpdate(p, 'content', e.content);
}
