import { html, fixture, tDOM } from 'qing-t';
import './userCard';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<user-card></user-card>`);

  tDOM.isBlockElement(el);
});
