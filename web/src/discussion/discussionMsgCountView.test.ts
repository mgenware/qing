import { html, fixture, tDOM } from 'qing-t';
import './discussionMsgCountView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(
    html`<discussion-msg-count-view></discussion-msg-count-view>`,
  );

  tDOM.isBlockElement(el);
});
