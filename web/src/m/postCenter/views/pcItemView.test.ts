import { html, fixture, tDOM } from 'qing-t';
import './pcItemView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<pc-item-view></pc-item-view>`);

  tDOM.isBlockElement(el);
});
