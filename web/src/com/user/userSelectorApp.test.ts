import { html, fixture, tDOM } from 'qing-t';
import './userSelectorApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<user-selector-app></user-selector-app>`);

  tDOM.isBlockElement(el);
});
