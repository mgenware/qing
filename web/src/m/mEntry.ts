import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import app from 'app';
import './settings/settingsBaseView';
import './settings/profile/editProfileApp';
import './settings/userMgr/userMgrApp';
import 'post/setPostApp';
import './postCenter/myPostsApp';
import './postCenter/myDiscussionsApp';
import { entityPost, entityQuestion, entityDiscussion } from 'sharedConstants';
import { CHECK } from 'checks';
import { MiniURLRouter } from 'lib/miniURLRouter';
import { SettingsPages } from './settings/settingsBaseView';

const mRouter = new MiniURLRouter();

function loadSettingsContent(selectedPage: SettingsPages, title: string, content: TemplateResult) {
  app.page.setTitleAndMainContent(
    [title],
    html`<settings-base-view .selectedPage=${selectedPage}>${content}</settings-base-view>`,
  );
}

function loadNewPostContent(entityType: number) {
  CHECK(entityType);

  let url: string;
  let title: string;
  switch (entityType) {
    case entityPost: {
      url = routes.m.newPost;
      title = ls.newPost;
      break;
    }
    case entityDiscussion: {
      url = routes.m.newDiscussion;
      title = ls.newDiscussion;
      break;
    }
    case entityQuestion: {
      url = routes.m.newQuestion;
      title = ls.newQuestion;
      break;
    }
    default: {
      throw new Error(`Invalid entity type ${entityType}`);
    }
  }

  mRouter.register(url, () =>
    app.page.setTitleAndMainContent(
      [title],
      html` <set-post-app .entityType=${entityType} .headerText=${title}></set-post-app> `,
    ),
  );
}

[entityPost, entityDiscussion, entityQuestion].forEach((entityType) => {
  loadNewPostContent(entityType);
});

mRouter.register(`${routes.m.editPost}/:id`, (args) => {
  const id = args.id as string;
  if (!id) {
    return;
  }
  app.page.setTitleAndMainContent(
    [ls.editPost],
    html` <set-post-app .editedID=${id}></set-post-app> `,
  );
});
mRouter.register(routes.m.settings.profile, () => {
  loadSettingsContent(
    SettingsPages.profile,
    ls.editProfile,
    html` <edit-profile-app></edit-profile-app> `,
  );
});
mRouter.register(routes.m.settings.usersAndGroups, () => {
  loadSettingsContent(
    SettingsPages.userAndGroups,
    ls.usersAndGroups,
    html` <user-mgr-app></user-mgr-app> `,
  );
});
mRouter.register(routes.m.yourPosts, () => {
  app.page.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
mRouter.register(routes.m.yourDiscussions, () => {
  app.page.setTitleAndMainContent(
    [ls.yourDiscussions],
    html`<my-discussions-app></my-discussions-app>`,
  );
});

mRouter.startOnce();
