import { MiniURLRouter } from 'lib/miniURLRouter';
import { html, TemplateResult } from 'lit-element';
import routes from './devRoutes';
import './devView';
import './auth/authDevPage';
import './ui/elementsDev';
import app from 'app';
import { routeDevPage } from 'sharedConstants';

const devRouter = new MiniURLRouter();

function loadPageContent(title: string, content: TemplateResult) {
  app.page.setTitleAndMainContent([title], html` <container-view> ${content} </container-view> `);
}

devRouter.register(routes.authRoot, () => {
  loadPageContent('Auth dev page', html`<auth-dev-page></auth-dev-page>`);
});
devRouter.register(routes.elements, () => {
  loadPageContent('Elements dev page', html`<elements-dev></elements-dev>`);
});

devRouter.register(`/${routeDevPage}`, () => {
  loadPageContent('Dev page', html` <dev-view></dev-view>`);
});

devRouter.startOnce();
