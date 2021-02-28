import { html, fixture, tDOM } from 'qing-t';
import './tagView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<tag-view></tag-view>`);

  tDOM.isInlineElement(el);
});
