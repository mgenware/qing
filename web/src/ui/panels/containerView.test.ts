import { html, fixture, tDOM } from 'qing-t';
import './containerView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<container-view></container-view>`);

  tDOM.isBlockElement(el);
});
