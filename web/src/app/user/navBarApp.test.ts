import { html, fixture, tDOM } from 'qing-t';
import './navBarApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<nav-bar-app></nav-bar-app>`);

  tDOM.isBlockElement(el);
});
