import { html, fixture, tDOM } from 'qing-t';
import './inputErrorView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<input-error-view></input-error-view>`);

  tDOM.isInlineBlockElement(el);
});
