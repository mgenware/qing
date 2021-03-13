import { html, fixture, tDOM } from 'qing-t';
import './setPostApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<set-post-app></set-post-app>`);

  tDOM.isBlockElement(el);
});
