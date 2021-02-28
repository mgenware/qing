import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './itemCounter';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<item-counter></item-counter>`);

  tDOM.isInlineElement(el);
});
