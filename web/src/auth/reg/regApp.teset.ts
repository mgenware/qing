import { html, fixture, tDOM } from 'qing-t';
import './regApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<reg-app></reg-app>`);

  tDOM.isBlockElement(el);
});
