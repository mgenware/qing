import { html, fixture, tDOM } from 'qing-t';
import './userMgrApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<user-mgr-app></user-mgr-app>`);

  tDOM.isBlockElement(el);
});
