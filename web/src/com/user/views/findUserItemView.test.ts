import { html, fixture, tDOM } from 'qing-t';
import './findUserItemView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<find-user-item-view></find-user-item-view>`);

  tDOM.isBlockElement(el);
});
