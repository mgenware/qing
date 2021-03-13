import { html, fixture, tDOM } from 'qing-t';
import './cmtFooterView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-footer-view></cmt-footer-view>`);

  tDOM.isBlockElement(el);
});
