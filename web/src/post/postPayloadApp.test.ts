import { html, fixture, tDOM } from 'qing-t';
import './postPayloadApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<post-payload-app></post-payload-app>`);

  tDOM.isBlockElement(el);
});
