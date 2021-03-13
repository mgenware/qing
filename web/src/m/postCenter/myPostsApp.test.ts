import { html, fixture, tDOM } from 'qing-t';
import './myPostsApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<my-posts-app></my-posts-app>`);

  tDOM.isBlockElement(el);
});
