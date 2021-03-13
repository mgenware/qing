import { html, fixture, tDOM } from 'qing-t';
import './forumSettingsBaseView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(
    html`<forum-settings-base-view></forum-settings-base-view>`,
  );

  tDOM.isBlockElement(el);
});
