import { html, fixture, tDOM } from 'qing-t';
import './sectionView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<section-view></section-view>`);

  tDOM.isBlockElement(el);
});
