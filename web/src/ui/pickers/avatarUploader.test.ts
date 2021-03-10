import { html, fixture, tDOM } from 'qing-t';
import './avatarUploader';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<avatar-uploader></avatar-uploader>`);

  tDOM.isBlockElement(el);
});
