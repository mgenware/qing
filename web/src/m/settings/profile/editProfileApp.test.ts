import { html, fixture, tDOM } from 'qing-t';
import './editProfileApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<edit-profile-app></edit-profile-app>`);

  tDOM.isBlockElement(el);
});
