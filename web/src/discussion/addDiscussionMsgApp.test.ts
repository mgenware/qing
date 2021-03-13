import { html, fixture, tDOM } from 'qing-t';
import './addDiscussionMsgApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<add-discussion-msg-app></add-discussion-msg-app>`);

  tDOM.isBlockElement(el);
});
