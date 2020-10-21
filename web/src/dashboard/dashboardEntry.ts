import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import page from 'page';
import rs from 'routes';
import app from 'app';
import './settings/settingsBaseView';
import 'post/setPostApp';
import * as htmlLib from 'lib/htmlLib';
import './settings/profile/editProfileApp';
import './mp/myPostsApp';
import {
  forumPostTypePost,
  forumPostTypeQuestion,
  postDestinationForum,
  postDestinationUser,
} from 'app/sharedConstants';

function loadContent(title: string, content: TemplateResult) {
  document.title = `${title} - ${ls._siteName}`;
  htmlLib.renderTemplateResult(
    app.browser.mainContentElement,
    html`<container-view>${content}</container-view>`,
  );
}

function loadSettingsContent(title: string, content: TemplateResult) {
  loadContent(title, html`<settings-base-view>${content}</settings-base-view>`);
}

function loadNewPostContent(destination: number, type: number) {
  let url: string;
  let title: string;
  if (destination === postDestinationUser) {
    url = rs.home.newPost;
    title = ls.newPost;
  } else if (destination === postDestinationForum) {
    if (type !== forumPostTypePost && type !== forumPostTypeQuestion) {
      throw new Error(`Invalid post type ${type}`);
    }
    url = type === forumPostTypePost ? rs.home.newThread : rs.home.newQuestion;
    title = type === forumPostTypePost ? ls.newThread : ls.newQuestion;
  } else {
    throw new Error(`Invalid destination ${destination}`);
  }

  page(url, () =>
    loadContent(
      title,
      html`
        <set-post-app
          .postDestination=${destination}
          .postType=${type}
          .viewTitle=${title}
        ></set-post-app>
      `,
    ),
  );
}

loadNewPostContent(postDestinationUser, 0);
loadNewPostContent(postDestinationForum, forumPostTypePost);
loadNewPostContent(postDestinationForum, forumPostTypeQuestion);

page(`${rs.home.editPost}/:id`, (e) => {
  const { id } = e.params;
  if (!id) {
    return;
  }
  loadContent(ls.editPost, html` <set-post-app .editedID=${id}></set-post-app> `);
});
page(rs.home.settings.profile, () => {
  loadSettingsContent(ls.editProfile, html` <edit-profile-app></edit-profile-app> `);
});
page(rs.home.yourPosts, () => {
  loadContent(ls.editProfile, html`<my-posts-app></my-posts-app>`);
});
page('*', () => {
  loadContent('', html` <p>${ls.noContentAvailable}</p> `);
});
page();
