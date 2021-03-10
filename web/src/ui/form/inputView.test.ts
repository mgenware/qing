import { html, fixture, tDOM } from 'qing-t';
import './inputView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<input-view></input-view>`);

  tDOM.isBlockElement(el);
});
