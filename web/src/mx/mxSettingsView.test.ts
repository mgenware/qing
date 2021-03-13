import { html, fixture, tDOM } from 'qing-t';
import './mxSettingsView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<mx-settings-view></mx-settings-view>`);

  tDOM.isBlockElement(el);
});
