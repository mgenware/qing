import { html, fixture, tDOM } from 'qing-t';
import './buttonList';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<button-list></button-list>`);

  tDOM.isBlockElement(el);
});
