import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import page from 'page';
import rs from 'routes';
import 'post/setPostApp';
import * as htmlLib from 'lib/htmlLib';
import './settings/profile/editProfileApp';
import './mp/myPostsApp';
import app from 'app';

function loadContent(title: string, content: TemplateResult) {
  document.title = `${title} - ${ls._siteName}`;
  htmlLib.renderTemplateResult(
    app.browser.mainContentElement,
    html`<container-view>${content}</container-view>`,
  );
}

page(rs.home.newPost, () => {
  loadContent(ls.newPost, html` <set-post-app></set-post-app> `);
});
page(`${rs.home.editPost}/:id`, (e) => {
  const { id } = e.params;
  if (!id) {
    return;
  }
  loadContent(ls.editPost, html` <set-post-app .editedID=${id}></set-post-app> `);
});
page(rs.home.settings.profile, () => {
  loadContent(ls.editProfile, html` <edit-profile-app></edit-profile-app> `);
});
page(rs.home.posts, () => {
  loadContent(ls.editProfile, html`<my-posts-app></my-posts-app>`);
});
page('*', () => {
  loadContent('', html` <p>${ls.noContentAvailable}</p> `);
});
page();
