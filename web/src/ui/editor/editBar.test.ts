import { html, fixture, tDOM } from 'qing-t';
import './editBar';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<edit-bar></edit-bar>`);

  tDOM.isInlineElement(el);
});
