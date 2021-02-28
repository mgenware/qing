import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './statusOverlay';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<status-overlay></status-overlay>`);

  tDOM.isBlockElement(el);
});
