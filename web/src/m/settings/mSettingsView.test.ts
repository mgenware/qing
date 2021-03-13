import { html, fixture, tDOM } from 'qing-t';
import './mSettingsView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<m-settings-view></m-settings-view>`);

  tDOM.isBlockElement(el);
});
