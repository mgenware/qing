import { html, fixture, tDOM } from 'qing-t';
import './forumGeneralSettingsApp';

it('Display', async () => {
  const el = await fixture<HTMLElement>(
    html`<forum-general-settings-app></forum-general-settings-app>`,
  );

  tDOM.isBlockElement(el);
});
