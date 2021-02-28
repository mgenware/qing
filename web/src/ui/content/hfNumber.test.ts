import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './hfNumber';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<hf-number></hf-number>>`);

  tDOM.isInlineElement(el);
});
