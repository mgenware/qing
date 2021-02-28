import { html, fixture, tDOM } from 'qing-t';
import './headingView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<heading-view></heading-view>`);

  tDOM.isBlockElement(el);
});
