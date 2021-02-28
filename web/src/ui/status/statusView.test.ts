import { html, fixture, tDOM } from 'qing-t';
import 'debug/d/injectLangEN';
import './statusView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<status-view></status-view>`);

  tDOM.isBlockElement(el);
});
