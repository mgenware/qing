import { html, fixture, tDOM } from 'qing-t';
import './dialogView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<dialog-view></dialog-view>`);

  tDOM.isBlockElement(el);
});
