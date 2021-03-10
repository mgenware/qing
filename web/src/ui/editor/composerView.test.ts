import { html, fixture, tDOM } from 'qing-t';
import './composerView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<composer-view></composer-view>`);

  tDOM.isBlockElement(el);
});
