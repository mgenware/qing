import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import rs from 'routes';
import app from 'app';
import './settings/settingsBaseView';
import 'post/setPostApp';
import './settings/profile/editProfileApp';
import './mp/myPostsApp';
import {
  entityPost,
  entityQuestion,
  postDestinationForum,
  postDestinationUser,
} from 'sharedConstants';
import { CHECK } from 'checks';
import { MiniURLRouter } from 'lib/miniURLRouter';

const dashboardRouter = new MiniURLRouter();

function loadSettingsContent(title: string, content: TemplateResult) {
  app.page.reloadPageContent(title, html`<settings-base-view>${content}</settings-base-view>`);
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

  dashboardRouter.register(url, () =>
    app.page.reloadPageContent(
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

dashboardRouter.register(`${rs.home.editPost}/:id`, (args) => {
  const id = args.id as string;
  if (!id) {
    return;
  }
  app.page.reloadPageContent(ls.editPost, html` <set-post-app .editedID=${id}></set-post-app> `);
});
dashboardRouter.register(rs.home.settings.profile, () => {
  loadSettingsContent(ls.editProfile, html` <edit-profile-app></edit-profile-app> `);
});
dashboardRouter.register(rs.home.yourPosts, () => {
  app.page.reloadPageContent(ls.editProfile, html`<my-posts-app></my-posts-app>`);
});

dashboardRouter.startOnce();
