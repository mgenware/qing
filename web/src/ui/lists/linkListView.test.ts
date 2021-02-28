import { html, fixture, tDOM } from 'qing-t';
import './linkListView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<link-list-view></link-list-view>`);

  tDOM.isBlockElement(el);
});
