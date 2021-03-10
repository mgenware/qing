import { html, fixture, tDOM } from 'qing-t';
import './editorView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<edit-view></edit-view>`);

  tDOM.isInlineElement(el);
});
