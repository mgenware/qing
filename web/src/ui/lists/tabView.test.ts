import { html, fixture, tDOM } from 'qing-t';
import './tabView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<tab-view></tab-view>`);

  tDOM.isBlockElement(el);
});
