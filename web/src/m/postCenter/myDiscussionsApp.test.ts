import { html, fixture, tDOM } from 'qing-t';
import './myDiscussionsApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<my-discussion-app></my-discussion-app>`);

  tDOM.isBlockElement(el);
});
