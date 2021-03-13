import { html, fixture, tDOM } from 'qing-t';
import './cmtApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<cmt-app></cmt-app>`);

  tDOM.isBlockElement(el);
});
