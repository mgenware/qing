import { html, fixture, tDOM } from 'qing-t';
import './cmtListView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-list-view></cmt-list-view>`);

  tDOM.isBlockElement(el);
});
