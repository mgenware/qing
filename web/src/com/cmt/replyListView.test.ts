import { html, fixture, tDOM } from 'qing-t';
import './replyListView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<reply-list-view></reply-list-view>`);

  tDOM.isBlockElement(el);
});
