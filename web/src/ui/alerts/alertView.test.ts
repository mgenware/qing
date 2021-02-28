import { html, fixture, tDOM } from 'qing-t';
import './alertView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<alert-view></alert-view>`);

  tDOM.isBlockElement(el);
});
