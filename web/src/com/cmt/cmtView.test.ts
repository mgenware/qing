import { html, fixture, tDOM } from 'qing-t';
import './cmtView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-view></cmt-view>`);

  tDOM.isBlockElement(el);
});
