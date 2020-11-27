import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import rs from 'routes';
import app from 'app';
import './settings/settingsBaseView';
import 'post/setPostApp';
import './settings/profile/editProfileApp';
import './mp/myPostsApp';
import './mp/myDiscussionsApp';
import { entityPost, entityQuestion, entityDiscussion } from 'sharedConstants';
import { CHECK } from 'checks';
import { MiniURLRouter } from 'lib/miniURLRouter';

const dashboardRouter = new MiniURLRouter();

function loadSettingsContent(title: string, content: TemplateResult) {
  app.page.reloadPageContent(title, html`<settings-base-view>${content}</settings-base-view>`);
}

function loadNewPostContent(entityType: number) {
  CHECK(entityType);

  let url: string;
  let title: string;
  switch (entityType) {
    case entityPost: {
      url = rs.home.newPost;
      title = ls.newPost;
      break;
    }
    case entityDiscussion: {
      url = rs.home.newDiscussion;
      title = ls.newDiscussion;
      break;
    }
    case entityQuestion: {
      url = rs.home.newQuestion;
      title = ls.newQuestion;
      break;
    }
    default: {
      throw new Error(`Invalid entity type ${entityType}`);
    }
  }

  dashboardRouter.register(url, () =>
    app.page.reloadPageContent(
      title,
      html` <set-post-app .entityType=${entityType} .headerText=${title}></set-post-app> `,
    ),
  );
}

[entityPost, entityDiscussion, entityQuestion].forEach((entityType) => {
  loadNewPostContent(entityType);
});

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
dashboardRouter.register(rs.home.yourDiscussions, () => {
  app.page.reloadPageContent(ls.editProfile, html`<my-discussions-app></my-discussions-app>`);
});

dashboardRouter.startOnce();
