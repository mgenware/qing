import { html, fixture, tDOM } from 'qing-t';
import './noticeView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<notice-view></notice-view>`);

  tDOM.isBlockElement(el);
});
