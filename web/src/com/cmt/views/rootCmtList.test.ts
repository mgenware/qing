import { html, fixture, tDOM } from 'qing-t';
import './rootCmtList';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<root-cmt-list></root-cmt-list>`);

  tDOM.isBlockElement(el);
});
