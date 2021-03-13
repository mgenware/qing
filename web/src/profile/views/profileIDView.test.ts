import { html, fixture, tDOM } from 'qing-t';
import './profileIDView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<profile-id-view></profile-id-view>`);

  tDOM.isBlockElement(el);
});
