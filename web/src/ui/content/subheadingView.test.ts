import { html, fixture, tDOM } from 'qing-t';
import './subheadingView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<subheading-view></subheading-view>`);

  tDOM.isBlockElement(el);
});
