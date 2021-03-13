import { html, fixture, tDOM } from 'qing-t';
import './pcListApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<pc-list-app></pc-list-app>`);

  tDOM.isBlockElement(el);
});
