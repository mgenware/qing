import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import app from 'app';
import './settings/mSettingsView';
import './settings/profile/editProfileApp';
import 'post/setPostApp';
import './postCenter/myPostsApp';
import './postCenter/myDiscussionsApp';
import { entityPost, entityQuestion, entityDiscussion } from 'sharedConstants';
import { CHECK } from 'checks';
import { MiniURLRouter } from 'lib/miniURLRouter';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  app.page.setTitleAndMainContent(
    [selectedItem, ls.settings],
    html`<m-settings-view .selectedItem=${selectedItem}>${content}</m-settings-view>`,
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

  router.register(url, () =>
    app.page.setTitleAndMainContent(
      [title],
      html` <set-post-app .entityType=${entityType} .headerText=${title}></set-post-app> `,
    ),
  );
}

[entityPost, entityDiscussion, entityQuestion].forEach((entityType) => {
  loadNewPostContent(entityType);
});

router.register(`${routes.m.editPost}/:id`, (args) => {
  const id = args.id as string;
  if (!id) {
    return;
  }
  app.page.setTitleAndMainContent(
    [ls.editPost],
    html` <set-post-app .editedID=${id} .entityType=${entityPost}></set-post-app> `,
  );
});
router.register(routes.m.settings.profile, () => {
  loadSettingsContent(ls.profile, html` <edit-profile-app></edit-profile-app> `);
});
router.register(routes.m.yourPosts, () => {
  app.page.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(routes.m.yourDiscussions, () => {
  app.page.setTitleAndMainContent(
    [ls.yourDiscussions],
    html`<my-discussions-app></my-discussions-app>`,
  );
});

router.startOnce();
