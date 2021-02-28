import { html, fixture, tDOM } from 'qing-t';
import './selectionView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<selection-view></selection-view>`);

  tDOM.isBlockElement(el);
});
