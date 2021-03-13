import { html, fixture, tDOM } from 'qing-t';
import './likeApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<like-app></like-app>`);

  tDOM.isInlineBlockElement(el);
});
