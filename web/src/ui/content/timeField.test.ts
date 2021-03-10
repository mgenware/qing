import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './timeField';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<time-field></time-field>`);

  tDOM.isInlineElement(el);
});
