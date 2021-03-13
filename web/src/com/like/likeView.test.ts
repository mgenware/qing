import { html, fixture, tDOM } from 'qing-t';
import './likeView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<like-view></like-view>`);

  tDOM.isInlineBlockElement(el);
});
