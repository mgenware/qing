import { html, fixture, tDOM } from 'qing-t';
import './cmtBlock';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-block></cmt-block>`);

  tDOM.isBlockElement(el);
});
