import { html, fixture, tDOM } from 'qing-t';
import './progressView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<progress-view></progress-view>`);

  tDOM.isInlineBlockElement(el);
});
