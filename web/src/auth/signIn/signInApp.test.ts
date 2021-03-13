import { html, fixture, tDOM } from 'qing-t';
import './signInApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<sign-in-app></sign-in-app>`);

  tDOM.isBlockElement(el);
});
