import { html, fixture, tDOM } from 'qing-t';
import './errorView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<error-view></error-view>`);

  tDOM.isBlockElement(el);
});
