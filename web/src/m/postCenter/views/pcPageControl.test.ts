import { html, fixture, tDOM } from 'qing-t';
import './pcPageControl';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<pc-page-control></pc-page-control>`);

  tDOM.isBlockElement(el);
});
