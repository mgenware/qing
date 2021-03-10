import { html, fixture, tDOM } from 'qing-t';
import './linkButton';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<link-button></link-button>`);

  tDOM.isInlineElement(el);
});
