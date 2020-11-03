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
  entityPost,
  entityQuestion,
  postDestinationForum,
  postDestinationUser,
} from 'sharedConstants';
import { CHECK } from 'checks';

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
  CHECK(destination);
  CHECK(type);

  let url: string;
  let title: string;
  if (destination === postDestinationUser) {
    if (type !== entityPost) {
      throw new Error(`Invalid post type ${type}`);
    }
    url = rs.home.newPost;
    title = ls.newPost;
  } else if (destination === postDestinationForum) {
    if (type !== entityPost && type !== entityQuestion) {
      throw new Error(`Invalid post type ${type}`);
    }
    url = type === entityPost ? rs.home.newThread : rs.home.newQuestion;
    title = type === entityPost ? ls.newThread : ls.newQuestion;
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

loadNewPostContent(postDestinationUser, entityPost);
loadNewPostContent(postDestinationForum, entityPost);
loadNewPostContent(postDestinationForum, entityQuestion);

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

// DO NOT add a default page handler, that will affect all pages.
// page('*', () => {
//   loadContent('', html` <p>${ls.noContentAvailable}</p> `);
// });

page();
