import { html, fixture, tDOM } from 'qing-t';
import './svgIcon';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<svg-icon></svg-icon>`);

  tDOM.isInlineElement(el);
});
