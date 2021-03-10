import { html, fixture, tDOM } from 'qing-t';
import './captchaView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<captcha-view></captcha-view>`);

  tDOM.isInlineBlockElement(el);
});
