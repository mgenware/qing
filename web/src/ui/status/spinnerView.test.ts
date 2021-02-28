import { html, fixture, tDOM } from 'qing-t';
import './spinnerView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<spinner-view></spinner-view>`);

  tDOM.isBlockElement(el);
});
